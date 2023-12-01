import { ReactNode, createContext, useState } from 'react'

export interface ClientProps {
  id: number
  nome: string
  email: string
  celular: number
  dataCadastro: string
  dataAtualizacao?: string
}

export interface ReceiptProps {
  id: number
  valor: number
  tipoPagamento: string
  dataPagamento: string
  cliente: ClientProps
}

interface ClientsContextType {
  clients: ClientProps[]
  setClients: (value: ClientProps[]) => void
  receipts: ReceiptProps[]
  setReceipts: (value: ReceiptProps[]) => void
}

export const ClientsContext = createContext({} as ClientsContextType)

interface ContextProviderProps {
  children: ReactNode
}

export function ContextProvider({ children }: ContextProviderProps) {
  const [clients, setClients] = useState<ClientProps[]>([])

  const [receipts, setReceipts] = useState<ReceiptProps[]>([])

  return (
    <ClientsContext.Provider
      value={{
        clients,
        setClients,
        receipts,
        setReceipts,
      }}
    >
      {children}
    </ClientsContext.Provider>
  )
}
