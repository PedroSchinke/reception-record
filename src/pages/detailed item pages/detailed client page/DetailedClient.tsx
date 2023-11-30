import { CaretLeft, Pencil, Trash } from 'phosphor-react'
import {
  DeleteClientButton,
  DetailedClientContainer,
  DetailedClientInfos,
  DetailedClientLayout,
  ClientOptionButtons,
  UpdateClientButton,
  Message,
  Overlay,
  OverlayContent,
  OverlayBackButton,
} from './styles'
import { NavLink, useParams } from 'react-router-dom'
import { useEffect, useState, useContext } from 'react'
import { api } from '../../../services/api'
import { formatDate } from '../../../services/format-date-service'
import { ClientProps, ClientsContext } from '../../../context/clientsContext'
import { Loading } from '../../../components/loading/Loading'

export function DetailedClient() {
  const { id } = useParams()

  const [client, setClient] = useState<ClientProps | null>(null)

  const [message, setMessage] = useState<string | null>(null)

  const { clients, setClients } = useContext(ClientsContext)

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(`/clientes/${id}`)

        setClient(response.data)
      } catch (error) {
        throw new Error('Erro ao carregar cliente')
      }
    }

    getData()
  }, [id])

  if (!client) {
    return <Loading />
  }

  const originalDates = [client.dataCadastro, client.dataAtualizacao]
  const formattedDates = formatDate(originalDates)

  const dataCadastro = formattedDates[0]
  const dataAtualizacao = formattedDates[1]

  const handleDeleteClient = async () => {
    try {
      const response = await api.delete(`/clientes/${id}`)

      if (response.status === 200) {
        console.log('Cliente deletado com sucesso!')

        const stringId = id
        const numberId = parseInt(stringId!, 10)

        const clientsWithoutDeletedOne = clients.filter((client) => {
          return client.id !== numberId
        })

        setClients(clientsWithoutDeletedOne)

        setMessage('Ciente deletado com sucesso!')
      } else {
        console.error('Erro ao deletar cliente. Status:', response.status)

        setMessage('Não foi possível deletar cliente')
      }
    } catch (error) {
      console.error('Não foi possível deletar cliente:', error)
    }
  }

  const showOverlay = message !== null

  return (
    <>
      <DetailedClientLayout>
        <DetailedClientContainer>
          <NavLink to="/consultar/cliente">
            <button className="back_button">
              <CaretLeft />
              Voltar
            </button>
          </NavLink>
          <h1>Detalhes do cliente</h1>
          <DetailedClientInfos>
            <div>
              <span>Nome</span>
              <h2>{client.nome}</h2>
            </div>
            <div>
              <span>Email</span>
              <h2>{client.email}</h2>
            </div>
            <div>
              <span>Telefone</span>
              <h2>{client.celular}</h2>
            </div>
            <div>
              <span>Cadastrado em</span>
              <h2>{dataCadastro}</h2>
            </div>
            <div>
              <span>Editado em</span>
              <h2>{dataAtualizacao}</h2>
            </div>
          </DetailedClientInfos>
          <ClientOptionButtons>
            <UpdateClientButton>
              <Pencil />
              editar
            </UpdateClientButton>
            <DeleteClientButton onClick={handleDeleteClient}>
              <Trash />
              excluir
            </DeleteClientButton>
          </ClientOptionButtons>
        </DetailedClientContainer>
      </DetailedClientLayout>
      {showOverlay && (
        <Overlay>
          <OverlayContent>
            <Message>{message}</Message>
            <NavLink to="/consultar/cliente">
              <OverlayBackButton>Voltar</OverlayBackButton>
            </NavLink>
          </OverlayContent>
        </Overlay>
      )}
    </>
  )
}
