import type {Account} from './Account.js'

export interface Bank {
    bankId: string
    primaryColor?: string
    logo?: string
    name: string
    accounts?: Array<Account>
}
