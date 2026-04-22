function useConvertToCSV(fileName = 'data') {
  function convertArrayToCSV(jsonData: Array<object>) {
    const header = Object.keys(jsonData[0]).join(',')
    const rows = jsonData.map(row => Object.values(row).join(','))
    return [header, ...rows].join('\n')
  }

  const handleExport = (data: string | Array<object>) => {
    let csvData = data
    if (Array.isArray(data)) {
      csvData = convertArrayToCSV(data)
    }
    const blob = new Blob([csvData as string], {
      type: 'text/csv;charset=utf-8;',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `${fileName}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return handleExport
}

export {useConvertToCSV}
