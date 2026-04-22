import dayjs from 'dayjs'
import clsx, {ClassValue} from 'clsx'
import {twMerge} from 'tailwind-merge'
// import lodash from 'lodash'
import utc from 'dayjs/plugin/utc'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import 'dayjs/locale/es'

import {
  CategoryMotorTypes,
  ContractBiometricActionType,
  ContractSignatureStatusType,
  DepositReturnStatusType,
  ModelTypes,
  PeriodTypes,
  PolicyStatusType,
  Quality,
  UnitHistoryType,
  UnitStatusType,
} from '@/types/enum'
import {
  ContractStatusTypes,
  FileTypes,
  MenusNames,
  UnitAssignedTypes,
} from '@/types'

dayjs.extend(utc)
dayjs.extend(localizedFormat)
dayjs.locale('es')

/**
 * "no-operation" function, a function that does nothing
 */
export const noop = () => {
  //
}

/**
 * Merges class names and resolves Tailwind utility conflicts.
 *
 * @param {ClassValue[]} classes Array of class values
 */
export const joinClasses = (...classes: ClassValue[]) => {
  return twMerge(clsx(classes))
}

/**
 * Gets the paginations range
 *
 * @param {number} start
 * @param {number} end
 */
export const paginationGetRange = (
  start: number,
  end: number,
): Array<string | number> => {
  return Array(end - start + 1)
    .fill(null)
    .map((_, i) => i + start)
}

/**
 *
 * @param {number} currentPage
 * @param {number} pageCount
 */
export const pagination = (currentPage: number, pageCount: number) => {
  let delta: number
  if (pageCount <= 7) {
    delta = 7
  } else {
    delta = currentPage > 4 && currentPage < pageCount - 3 ? 2 : 4
  }

  const range = {
    start: Math.round(currentPage - delta / 2),
    end: Math.round(currentPage + delta / 2),
  }

  if (range.start - 1 === 1 || range.end + 1 === pageCount) {
    range.start += 1
    range.end += 1
  }

  let pages =
    currentPage > delta
      ? paginationGetRange(
          Math.min(range.start, pageCount - delta),
          Math.min(range.end, pageCount),
        )
      : paginationGetRange(1, Math.min(pageCount, delta + 1))

  const withDots = (value: number, pair: Array<number | string>) =>
    pages.length + 1 !== pageCount ? pair : [value]

  if (pages[0] !== 1) {
    pages = withDots(1, [1, '...']).concat(pages)
  }

  if (parseInt(pages[pages.length - 1].toString()) < pageCount) {
    pages = pages.concat(withDots(pageCount, ['...', pageCount]))
  }

  return pages
}

/**
 * Returs a formatted dated
 *
 * @param {number | string } date Valid date
 */
export const humanDate = (
  date: number | string,
  format = 'lll',
  utcMode = false,
  addDay = 0,
) => {
  const dateAsUTC = dayjs(date).utc().add(addDay, 'day')

  if (utcMode) return dateAsUTC.format(format)

  return dateAsUTC.local().format(format).toUpperCase()
}

/**
 * Returs a period name
 *
 * @param {number | string } date Valid date
 */
export const periodName = (periodType: PeriodTypes) => {
  let periodName = 'Diario'

  switch (periodType) {
    case 'DAY':
      periodName = 'Diario'
      break
    case 'MONTH':
      periodName = 'Mensual'
      break
    case 'BIANNUAL':
      periodName = 'Semestral'
      break
    case 'YEAR':
      periodName = 'Anual'
      break
    case 'WEEK':
      periodName = 'Semanal'
      break
    default:
      periodName = 'Hora'
      break
  }
  return periodName
}

/**
 * Returs a formatted contract signature status
 *
 * @param {number | string } date Valid date
 */
export const contractSignatureStatusName = (
  status: ContractSignatureStatusType,
): {text: string; className: string} => {
  let text = 'Espera de firma'
  let className = 'bg-blue-100 text-blue-900'

  switch (status) {
    case 'APPROVED':
      text = 'Aprobado'
      className = 'bg-green-100 text-green-900'
      break
    case 'COMPLETE':
      text = 'Completado'
      className = 'bg-green-100 text-green-900'
      break
    case 'DECLINED':
      text = 'No Aprobado'
      className = 'bg-red-100 text-red-900'
      break
    default:
      text = 'Espera de firma'
      break
  }
  return {
    text,
    className: className,
  }
}

/**
 * Returs a formatted contract status
 *
 * @param {number | string } date Valid date
 */
export const contractStatusName = (
  status: ContractStatusTypes,
): {text: string; className: string} => {
  let text = 'Pre Contrato'
  let className = 'bg-blue-100 text-blue-900'

  switch (status) {
    case 'ACTIVE':
      text = 'Activo'
      className = 'bg-green-100 text-green-900'
      break
    case 'CLOSE':
      text = 'Cerrado'
      className = 'bg-gray-100 text-gray-900'
      break
    case 'CANCEL':
      text = 'Cancelado'
      className = 'bg-red-100 text-red-900'
      break
    case 'WAITING_FOR_PAYMENT':
      text = 'En Espera de Pago'
      className = 'bg-yellow-100 text-yellow-900'
      break
    case 'WAITING_FOR_VALIDATE':
      text = 'En Espera de validación'
      className = 'bg-yellow-100 text-yellow-900'
      break
    case 'WAITING_FOR_ACTIVE':
      text = 'En Espera de Aprobación'
      className = 'bg-yellow-100 text-yellow-900'
      break
    case 'EXPIRED':
      text = 'Expirado'
      className = 'bg-orange-100 text-orange-900'
      break
    case 'PAST_DUE':
      text = 'Incobrable'
      className = 'bg-orange-100 text-orange-900'
      break
    case 'PAST_DUE_RETURN':
      text = 'Incobrable con moto'
      className = 'bg-orange-100 text-orange-900'
      break
    case 'PAUSED':
      text = 'Pausado'
      className = 'bg-orange-100 text-orange-900'
      break
    default:
      text = 'Pre Contrato'
      break
  }
  return {
    text,
    className: className,
  }
}

/**
 * Returs a formatted dated
 *
 * @param {number | string } date Valid date
 */
export const contractActionName = (
  type: ContractBiometricActionType,
): {text: string; className: string} => {
  let text = 'Omitir Biometria'
  let className = 'bg-blue-100 text-blue-900'

  switch (type) {
    case 'BIOMETRIC_REPLY':
      text = 'Reintento de biometria'
      className = 'bg-green-100 text-green-900'
      break
    default:
      text = 'Omitir Biometria'
      className = 'bg-blue-100 text-blue-900'
      break
  }
  return {
    text,
    className: className,
  }
}

/**
 * Returs a formatted dated
 *
 * @param {number | string } date Valid date
 */
export const contractPlanType = (
  type: ModelTypes,
): {text: string; className: string} => {
  let text = 'Motoneta'
  let className = 'bg-blue-100 text-blue-900'

  switch (type) {
    case 'ELECTRIC':
      text = 'Electrica'
      className = 'bg-green-100 text-green-900'
      break
    case 'HEAVY_DUTY':
      text = 'De Trabajo'
      className = 'bg-purple-100 text-purple-900'
      break
    default:
      text = 'Motoneta'
      className = 'bg-blue-100 text-blue-900'
      break
  }
  return {
    text,
    className: className,
  }
}

export const motorType = (type: CategoryMotorTypes) => {
  switch (type) {
    case 'ELECTRIC':
      return {text: 'Electrico', className: 'bg-green-100 text-green-900'}
    default:
      return {text: 'Combustión', className: 'bg-yellow-100 text-yellow-900'}
  }
}

/**
 * Returs a formatted dated
 *
 * @param {number | string } date Valid date
 */
export const policyStatusName = (
  status: PolicyStatusType,
): {text: string; className: string} => {
  let text = 'EXPIRADO'
  let className = 'bg-red-100 text-red-900'

  switch (status) {
    case 'ON_DATE':
      text = 'ACTIVO'
      className = 'bg-green-100 text-green-900'
      break
    default:
      text = 'EXPIRADO'
      className = 'bg-red-100 text-red-900'
      break
  }
  return {
    text,
    className: className,
  }
}

/**
 * Returs a formatted dated
 *
 * @param {number | string } date Valid date
 */
export const periodUnitTime = (periodUnit: number, periodType: PeriodTypes) => {
  let periodName = 'Hora'
  const plural = periodUnit > 1 ? 's' : ''
  switch (periodType) {
    case 'DAY':
      periodName = `${periodUnit} Día${plural}`
      break
    case 'MONTH':
      periodName = `${periodUnit} Mes${periodUnit > 1 ? 'es' : ''}`
      break
    case 'BIANNUAL':
      periodName = `${periodUnit} Semestre${plural}`
      break
    case 'YEAR':
      periodName = `${periodUnit} Año${plural}`
      break
    case 'WEEK':
      periodName = `${periodUnit} Semana${plural}`
      break
    default:
      periodName = `${periodUnit} Hora${plural}`
      break
  }
  return periodName
}

/**
 * Password regex
 */
export const regexPassword = new RegExp(
  '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[.#?!@$%^&*-]).{6,20}$',
)

/**
 * Returns a valid avatar url based on the original url
 *
 * @param originalUrl Bucket URL
 * @param size Image size
 */
export const getAvatarUrl = (originalUrl: string, size = '100h') => {
  const split1 = originalUrl.split('.com/')
  const split2 = split1[1] ? split1[1].split('/') : null
  return split2
    ? `${split1[0]}.com/${split2[0]}/${size}/${split2[1]}`
    : originalUrl
}

/**
 * Prevents copy/paste in input
 *
 * @param {React.ClipboardEvent} event Clipboard Event
 */
export const preventPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
  event.preventDefault()
  return false
}

export const hasOwnProperty = (obj: {[key: string]: any}, property: string) => {
  return Object.prototype.hasOwnProperty.call(obj, property)
}

/**
 * Returs an object with the diff in days and hours
 *
 * @param {string | number} start
 * @param {string | number} end
 */
export const diffInDaysAndHours = (
  start: string | number,
  end: string | number,
) => {
  const dateStart = dayjs(start)
  const dateEnd = dayjs(end)

  const seconds = dateEnd.diff(dateStart, 'seconds')
  return new Date(seconds * 1000).toISOString().substr(11, 8)
}

/**
 * Formats any number with commas i.e: 1234567 = 1,234,567
 *
 * @param {number} number
 */
export const formatNumberWithCommas = (number: number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * Calculates the score for Model, Provider
 *
 * @param {number} success
 * @param {number} fails
 */
export const calculateScore = (success: number, fails: number) => {
  const sum = success + fails
  const scoreWithDecimal = ((success * 100) / sum) * 100 || 0

  return Math.trunc(scoreWithDecimal)
}

/**
 * Gets "Good", "Regular", "Bad" based in the model/provider score
 *
 * @param {number} score
 */
export const getQualityBasedInScore = (score: number) => {
  return score > 9500
    ? Quality.Good
    : score >= 9000
      ? Quality.Regular
      : Quality.Bad
}

/**
 * Gets the styles related with the quality
 *
 * @param {Quality} quality
 */
export const getQualityStyles = (quality: Quality) => {
  const styles: {[key in Quality]: string} = {
    Good: 'bg-green-25 text-green-900 border-green-200 focus:ring-green-400',
    Regular:
      'bg-yellow-25 text-yellow-900 border-yellow-600 focus:ring-yellow-400',
    Bad: 'bg-red-25 text-red-900 border-red-200 focus:ring-red-400',
  }

  return styles[quality]
}

/**
 * Gets unit assigned name
 *
 * @param {unit} unit
 */
export const assignedUnit = (assigned: UnitAssignedTypes): string => {
  let response = 'NOT ASIGNADO'
  switch (assigned) {
    case 'SALE_POINT':
      response = 'PUNTO DE VENTA'
      break
    case 'USER':
      response = 'USUARIO'
      break
    default:
      break
  }

  return response
}

export const UnitStatusName = (status: UnitStatusType | UnitHistoryType) => {
  let text = ''
  let className = ''

  switch (status) {
    case 'AVAILABLE':
      text = 'Disponible'
      className = 'bg-green-100 text-green-900'
      break
    case 'NOT_AVAILABLE':
      text = 'No Disponible'
      className = 'bg-gray-100 text-gray-900'
      break
    case 'RECOVERY':
      text = 'En Recuperación'
      className = 'bg-red-100 text-red-900'
      break
    case 'RETURN':
      text = 'Reingresada'
      className = 'bg-teal-100 text-teal-900'
      break
    case 'ASSIGNED':
      text = 'Asignada'
      className = 'bg-blue-100 text-blue-900'
      break
    case 'STOLEN':
      text = 'Robada'
      className = 'bg-red-100 text-red-900'
      break
    case 'MAINTENANCE':
      text = 'En Mantenimiento'
      className = 'bg-orange-100 text-orange-900'
      break
    default:
      text = 'Disponible'
      className = 'bg-green-100 text-green-900'
      break
  }

  return {text, className}
}

export const documentByFileType: Record<FileTypes, string> = {
  ID: 'Identificación oficial frontal',
  ADDRESS: 'Comprobante domicilio',
  LICENCE: 'Licencia',
  FILE: 'Archivo extra',
  IMAGE: 'Imagen',
  MINIATURE: 'Miniatura',
  ID_BACK: 'Identificación oficial reverso',
}

export const depositReturnStatusName = (status: DepositReturnStatusType) => {
  let text = ''
  let className = ''

  switch (status) {
    case 'APROVE':
      text = 'Aprobado'
      className = 'bg-green-100 text-green-900'
      break
    case 'CANCELLED':
      text = 'Cancelado'
      className = 'bg-red-100 text-red-900'
      break
    default:
      text = 'En Espera de aprobación'
      className = 'bg-yellow-100 text-yellow-900'
      break
  }

  return {text, className}
}

export const menuNames: Record<MenusNames, string> = {
  MENU: 'MENU',
  OTHERS: 'Otros',
}

export {dayjs}
