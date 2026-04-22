import * as React from 'react'

/**
 * Copy any text into clipboard, creates a dynamic `textarea`, copies the content
 * and then delets the element.
 *
 * @param {string} text Text to copy
 */
function useCopyToClipboard(text = ''): [boolean, () => void, () => void] {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => () => setCopied(false), [text])

  const copyToCliboard = (str = '') => {
    const elem = document.createElement('textarea')
    elem.value = str
    document.body.appendChild(elem)
    elem.focus()
    elem.select()
    const success = document.execCommand('copy')
    elem.remove()

    return success
  }

  const copy = React.useCallback(() => {
    if (!copied) {
      setCopied(copyToCliboard(text))
    }
  }, [copied, text])

  const undoCopy = React.useCallback(() => {
    if (copied) setCopied(false)
  }, [copied])

  return [copied, copy, undoCopy]
}

export {useCopyToClipboard}
