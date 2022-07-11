import {Account} from './Account'

export interface Bank {
    bankId: string
    primaryColor: string
    logo?: string
    name: string
    accounts?: Array<Account>
}
