import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ConfirmEditButton,
  EditClientContainer,
  EditClientForm,
  EditClientFormError,
  EditClientLayout,
  Message,
  Overlay,
  OverlayBackButton,
  OverlayContent,
} from './styles'
import { api } from '../../services/api'
import { useEffect, useState, useContext } from 'react'
import { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { NavLink, useParams } from 'react-router-dom'
import { CaretLeft } from 'phosphor-react'
import { ClientsContext } from '../../context/clientsContext'
import InputMask from 'react-input-mask'

const EditClientSchema = z.object({
  nome: z.string().trim().min(1, 'É preciso preencher o nome do cliente'),
  email: z
    .string()
    .trim()
    .min(1, 'É preciso preencher o email do cliente')
    .email('Formato de email inválido'),
  celular: z
    .string({
      invalid_type_error: 'É preciso digitar um número de celular válido',
    })
    .min(9, 'É preciso digitar um número de celular válido'),
})

type editDataProps = z.infer<typeof EditClientSchema>

export function EditClient() {
  const { id } = useParams()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<editDataProps>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(EditClientSchema),
  })

  const { setClients } = useContext(ClientsContext)

  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const getData = async () => {
      const response = await api.get(`/clientes/${id}`)

      if (response.status === 200) {
        setValue('nome', response.data.nome)
        setValue('email', response.data.email)

        const numberWithoutMask = response.data.celular.replace(/\D/g, '')

        setValue('celular', numberWithoutMask)
      }
    }

    getData()
  }, [id, setValue])

  const handleEditClient = async (data: editDataProps) => {
    const response = await api.get(`/clientes/${id}`)
    const currentData = response.data

    if (
      currentData.nome === data.nome &&
      currentData.email === data.email &&
      currentData.celular === data.celular
    ) {
      setMessage(
        'É preciso alterar ao menos um dos campos para realizar a edição',
      )
      return
    }

    try {
      EditClientSchema.parse(data)

      const response = await api.put(`/clientes/${id}`, data)

      if (response.status === 200) {
        setMessage('Cliente editado com sucesso!')

        setClients([])
      } else {
        setMessage('Erro ao editar cliente')
      }
    } catch (error) {
      console.error(error)

      if (isAxiosError(error)) {
        const axiosError = error as AxiosError

        if (axiosError.response) {
          const responseData = axiosError.response.data as { detail?: string }

          if (responseData.detail) {
            setMessage(`Erro ao editar cliente: ${responseData.detail}`)
          } else {
            setMessage('Erro ao editar cliente. Detalhes indisponíveis.')
          }
        } else if (axiosError.request) {
          setMessage(
            'Erro de comunicação com o servidor. Tente novamente mais tarde.',
          )
        } else {
          setMessage('Ocorreu um erro inesperado. Tente novamente mais tarde.')
        }
      } else {
        setMessage('Ocorreu um erro inesperado. Tente novamente mais tarde.')
      }
    }
  }

  const isAxiosError = (error: any): error is AxiosError => {
    return error.isAxiosError !== undefined
  }

  const showOverlay = message !== null

  return (
    <>
      <EditClientLayout>
        <EditClientContainer>
          <div className="back_button_container">
            <NavLink to={`/consultar/cliente/detalhes/${id}`}>
              <button className="back_button">
                <CaretLeft />
                Voltar
              </button>
            </NavLink>
          </div>
          <h1>Editar Cliente</h1>
          <EditClientForm
            id="register_form"
            onSubmit={handleSubmit(handleEditClient)}
          >
            <label>
              Nome
              <input id="nome" {...register('nome')} />
              {errors.nome && (
                <EditClientFormError>{errors.nome.message}</EditClientFormError>
              )}
            </label>

            <label>
              Email
              <input type="email" id="email" {...register('email')} />
              {errors.email && (
                <EditClientFormError>
                  {errors.email.message}
                </EditClientFormError>
              )}
            </label>

            <label>
              Telefone
              <InputMask
                mask="(99) 99999-9999"
                type="text"
                id="celular"
                {...register('celular')}
              />
              {errors.celular && (
                <EditClientFormError>
                  {errors.celular.message}
                </EditClientFormError>
              )}
            </label>
          </EditClientForm>
          <ConfirmEditButton type="submit" form="register_form">
            Editar
          </ConfirmEditButton>
        </EditClientContainer>
      </EditClientLayout>
      {showOverlay && (
        <Overlay>
          <OverlayContent>
            <Message>{message}</Message>
            <NavLink
              to={
                message === 'Cliente editado com sucesso!'
                  ? `/consultar/cliente/detalhes/${id}`
                  : `/editar/cliente/${id}`
              }
              onClick={() => setMessage(null)}
            >
              <OverlayBackButton>Voltar</OverlayBackButton>
            </NavLink>
          </OverlayContent>
        </Overlay>
      )}
    </>
  )
}
