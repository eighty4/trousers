import {DataTypes, Model, Sequelize} from '@sequelize/core'
import {ModelStatic} from '@sequelize/core/types/model'

import type {ConnectionOpts} from './ConnectionOpts'

export class BankModel extends Model {
    declare bankId: string
    declare name: string
    declare primaryColor: string
    declare logo: string
    declare created: Date
    declare updated: Date
}

class LinkedBankModel extends Model {
    declare bankId: string
    declare itemId: string
    declare userId: string
    declare accessToken: string
    declare bank: BankModel
    declare accounts: Array<LinkedAccountModel>
    declare created: Date
    declare updated: Date
}

class LinkedAccountModel extends Model {
    declare linkedAccountId: string
    declare displayName: string
    declare officialName: string
    declare mask: string
    declare type: string
    declare subtype: string
    declare linkedBank: LinkedBankModel
    declare balances: AccountBalancesModel
    declare transactions: Array<TransactionModel>
    declare created: Date
    declare updated: Date
}

class AccountBalancesModel extends Model {
    declare linkedAccountId: string
    declare currencyCode: string
    declare available: string
    declare current: string
    declare limit: string
    declare account: LinkedAccountModel
    declare created: Date
    declare updated: Date
}

class TransactionModel extends Model {
    declare transactionId: string
    declare linkedAccountId: string
    declare amount: number
    declare name: string
    declare date: Date
    declare account: LinkedAccountModel
    declare created: Date
    declare updated: Date
}

export class DatabaseModels {
    private readonly sequelize
    readonly Bank: ModelStatic<BankModel>
    readonly LinkedBank: ModelStatic<LinkedBankModel>
    readonly LinkedAccount: ModelStatic<LinkedAccountModel>
    readonly AccountBalances: ModelStatic<AccountBalancesModel>
    readonly Transaction: ModelStatic<TransactionModel>

    constructor(connectionOptsOrUri: string | ConnectionOpts) {
        if (!connectionOptsOrUri) {
            throw new Error('connectionOptsOrUri must be a string or instance of ConnectionOpts')
        } else if (typeof connectionOptsOrUri === 'string') {
            this.sequelize = new Sequelize(connectionOptsOrUri as string)
        } else {
            this.sequelize = new Sequelize(connectionOptsOrUri as ConnectionOpts)
        }

        this.Bank = BankModel.init({
            bankId: {
                field: 'bank_id',
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                field: 'name',
                type: DataTypes.STRING,
                allowNull: false,
            },
            primaryColor: {
                field: 'primary_color',
                type: DataTypes.CHAR(6),
                validate: {
                    len: [6, 6],
                },
            },
            logo: {
                field: 'logo',
                type: DataTypes.BLOB,
            },
        }, {
            modelName: 'Bank',
            tableName: 'banks',
            sequelize: this.sequelize,
            timestamps: true,
            createdAt: 'created',
            updatedAt: 'updated',
        })

        this.LinkedBank = LinkedBankModel.init({
            itemId: {
                field: 'item_id',
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false,
            },
            userId: {
                field: 'user_id',
                type: DataTypes.STRING,
                unique: 'uniqueLinkedBankUserKeys',
                allowNull: false,
            },
            bankId: {
                field: 'bank_id',
                type: DataTypes.STRING,
                unique: 'uniqueLinkedBankUserKeys',
                allowNull: false,
            },
            accessToken: {
                field: 'access_token',
                type: DataTypes.STRING,
                allowNull: false,
            },
        }, {
            modelName: 'LinkedBank',
            tableName: 'linked_banks',
            sequelize: this.sequelize,
            timestamps: true,
            createdAt: 'created',
            updatedAt: 'updated',
        })

        this.LinkedAccount = LinkedAccountModel.init({
            linkedAccountId: {
                field: 'linked_account_id',
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false,
            },
            itemId: {
                field: 'item_id',
                type: DataTypes.STRING,
                allowNull: false,
            },
            displayName: {
                field: 'display_name',
                type: DataTypes.STRING,
                allowNull: false,
            },
            officialName: {
                field: 'official_name',
                type: DataTypes.STRING,
            },
            mask: {
                field: 'mask',
                type: DataTypes.CHAR(4),
                validate: {
                    len: [4, 4],
                },
            },
            type: {
                field: 'account_type',
                type: DataTypes.STRING,
                allowNull: false,
            },
            subtype: {
                field: 'account_subtype',
                type: DataTypes.STRING,
            },
        }, {
            modelName: 'LinkedAccount',
            tableName: 'linked_accounts',
            sequelize: this.sequelize,
            timestamps: true,
            createdAt: 'created',
            updatedAt: 'updated',
        })

        this.AccountBalances = AccountBalancesModel.init({
            linkedAccountId: {
                field: 'linked_account_id',
                type: DataTypes.STRING,
                allowNull: false,
            },
            currencyCode: {
                field: 'currency_code',
                type: DataTypes.CHAR(3),
                allowNull: false,
                validate: {
                    len: [3, 3],
                },
            },
            available: {
                field: 'balance_available',
                type: DataTypes.DECIMAL,
            },
            current: {
                field: 'balance_current',
                type: DataTypes.DECIMAL,
            },
            limit: {
                field: 'balance_limit',
                type: DataTypes.DECIMAL,
            },
        }, {
            modelName: 'AccountBalances',
            tableName: 'account_balances',
            sequelize: this.sequelize,
            timestamps: true,
            createdAt: 'created',
            updatedAt: 'updated',
        })

        this.Transaction = TransactionModel.init({
            transactionId: {
                field: 'transaction_id',
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false,
            },
            linkedAccountId: {
                field: 'linked_account_id',
                type: DataTypes.STRING,
                allowNull: false,
            },
            amount: {
                field: 'amount',
                type: DataTypes.DECIMAL,
                allowNull: false,
            },
            name: {
                field: 'name',
                type: DataTypes.STRING,
                allowNull: false,
            },
            date: {
                field: 'date',
                type: DataTypes.STRING,
                allowNull: false,
            },
        }, {
            modelName: 'Transaction',
            tableName: 'transactions',
            sequelize: this.sequelize,
            timestamps: true,
            createdAt: 'created',
            updatedAt: 'updated',
        })

        this.LinkedBank.belongsTo(this.Bank, {
            as: 'bank',
            foreignKey: {
                name: 'bankId',
                allowNull: false,
            },
        })
        this.LinkedBank.hasMany(this.LinkedAccount, {
            as: 'accounts',
            foreignKey: {
                name: 'itemId',
                allowNull: false,
            },
        })

        this.LinkedAccount.belongsTo(this.LinkedBank, {
            as: 'linkedBank',
            foreignKey: {
                name: 'itemId',
                allowNull: false,
            },
        })
        this.LinkedAccount.hasOne(this.AccountBalances, {
            as: 'balances',
            foreignKey: {
                name: 'linkedAccountId',
                allowNull: false,
            },
        })
        this.LinkedAccount.hasMany(this.Transaction, {
            as: 'transactions',
            foreignKey: {
                name: 'linkedAccountId',
                allowNull: false,
            },
        })

        this.AccountBalances.belongsTo(this.LinkedAccount, {
            as: 'account',
            foreignKey: {
                name: 'linkedAccountId',
                allowNull: false,
            },
        })

        this.Transaction.belongsTo(this.LinkedAccount, {
            as: 'account',
            foreignKey: {
                name: 'linkedAccountId',
                allowNull: false,
            },
        })
    }

    async syncSchemaWithDatabase() {
        await this.sequelize.sync({force: process.env.NODE_ENV === 'test'})
    }
}
