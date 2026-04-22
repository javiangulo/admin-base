import {PaginationParams} from './pagination'

type AppTypes = 'ADMIN'

type BodyTypes = 'HTML' | 'PLAIN_TEXT'

type ChannelPaymentTypes = 'CASH' | 'CARD' | 'SPEI' | 'LINK'

type ContractStatusTypes =
  | 'PRE_CONTRACT'
  | 'ACTIVE'
  | 'EXPIRED'
  | 'CLOSE'
  | 'CANCEL'
  | 'WAITING_FOR_PAYMENT'
  | 'WAITING_FOR_ACTIVE'
  | 'WAITING_FOR_VALIDATE'
  | 'PAST_DUE'
  | 'PAST_DUE_RETURN'
  | 'PAUSED'

type ContractBiometricActionType = 'BIOMETRIC_REPLY' | 'BIOMETRIC_SKIPPED'

type ContractSignatureStatusType =
  | 'SIGNATURE_PROGRESS'
  | 'APPROVED'
  | 'COMPLETE'
  | 'DECLINED'

type Currencies = 'MXN' | 'USD'

type EnumOptions = {options: Array<{label: string; value: string}>}

type FileTypes =
  | 'ID'
  | 'ADDRESS'
  | 'LICENCE'
  | 'FILE'
  | 'IMAGE'
  | 'MINIATURE'
  | 'ID_BACK'

type FileSecurityTypes = 'PUBLIC_READ' | 'PRIVATE'

type FileSaveTypes = 'USER' | 'UNIT' | 'SELF' | 'MOTORCYCLE'

type ModelTypes = 'MOTORCYCLE' | 'HEAVY_DUTY' | 'ELECTRIC'

type CategoryMotorTypes = 'COMBUSTION' | 'ELECTRIC'

type NotificationTypes = 'EMAIL' | 'PUSH' | 'SMS' | 'ALARM'

type NotificationStatusType =
  | 'CANCEL'
  | 'NEW'
  | 'PENDING'
  | 'ACTIVE'
  | 'SUCCESS'

type PaymentStatusTypes = 'PROCCESSED' | 'WAITING_FOR_PAYMENT' | 'CANCELLED'

type PaymentServiceTypes = 'PLAN' | 'PRODUCTS' | 'DEPOSIT' | 'OTHER_CHARGE'

type ProcessorPaymentTypes = 'OPENPAY' | 'PAYPAL' | 'PAYNET' | 'CONEKTA'

type PeriodTypes = 'HR' | 'DAY' | 'WEEK' | 'MONTH' | 'BIANNUAL' | 'YEAR'

type PolicyStatusType = 'EXPIRED' | 'ON_DATE'

type RepeatUnitTypes = 'WEEK' | 'MONTH' | 'YEAR'

type RoleTypes = 'FULL' | 'CREATE' | 'READ' | 'UPDATE' | 'DELETE'

type SortDirectionTypes = 'ASC' | 'DESC'

type UnitAssignedTypes = 'USER' | 'SALE_POINT' | 'NOT_ASSIGNED'

type UnitAssignedFilterTypes = 'ASSIGNED' | 'NOT_ASSIGNED' | 'ALL'

type UserTypes = 'COLLABORATOR' | 'OUTSIDE_COLLABORATOR' | 'USER'

type UnitHistoryType =
  | 'RETURN'
  | 'MAINTENANCE'
  | 'ASSIGNED'
  | 'RECOVERY'
  | 'AVAILABLE'
  | 'NOT_AVAILABLE'
  | 'STOLEN'

type UnitStatusType =
  | 'RETURN'
  | 'AVAILABLE'
  | 'MAINTENANCE'
  | 'ASSIGNED'
  | 'RECOVERY'
  | 'NOT_AVAILABLE'
  | 'STOLEN'

type ContractLogOperations =
  | 'payContract'
  | 'acceptContract'
  | 'updateContract'
  | 'renewContract'
  | 'cancelContract'
  | 'closeContract'
  | 'payContractApp'
  | 'pendingPaymentsContract'
  | 'createFile'
  | 'deleteFile'

type ContractLogsParams = {
  id?: string
  operations: ContractLogOperations[]
  params: PaginationParams
}

type DepositReturnStatusType = 'APROVE' | 'CANCELLED' | 'WAITING_FOR_APROVE'

export enum Quality {
  Good = 'Good',
  Regular = 'Regular',
  Bad = 'Bad',
}

type ReferreceBenefitsType = 'WAITING_FOR_APPLY' | 'APPLIED' | 'CANCELLED'

export type {
  AppTypes,
  BodyTypes,
  CategoryMotorTypes,
  ContractBiometricActionType,
  ContractLogsParams,
  ContractStatusTypes,
  ContractSignatureStatusType,
  ContractLogOperations,
  ChannelPaymentTypes,
  Currencies,
  DepositReturnStatusType,
  EnumOptions,
  FileTypes,
  FileSecurityTypes,
  FileSaveTypes,
  ModelTypes,
  NotificationStatusType,
  NotificationTypes,
  PaymentServiceTypes,
  PaymentStatusTypes,
  PeriodTypes,
  PolicyStatusType,
  ProcessorPaymentTypes,
  ReferreceBenefitsType,
  RepeatUnitTypes,
  RoleTypes,
  UnitAssignedTypes,
  UnitAssignedFilterTypes,
  UnitStatusType,
  UserTypes,
  UnitHistoryType,
  SortDirectionTypes,
}
