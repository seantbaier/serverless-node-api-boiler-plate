export default formatDataByOrganization = async (salesForceReport) => {
  let reformattedData = []
  const ficeNumbers = []

  salesForceReport.map((item) => {
    const {
      fice,
      opportunityNumber,
      orderLine,
      committedVolume,
      quantitySalesForce,
      quantityDelivered,
      quantityRemaining,
      quantity
    } = item

    const ficeIndex = ficeNumbers.indexOf(fice)
    if (ficeIndex === -1) {
      ficeNumbers.push(fice)

      const orgData = {
        [fice]: {
          ...item,
          initialSalesForceQuantity: parseFloat(quantity) || 0,
          quantityCommittedSalesForce: parseInt(committedVolume || 0),
          quantitySalesForce: parseInt(quantitySalesForce || 0),
          quantityDeliveredSalesForce: parseInt(quantityDelivered || 0),
          quantityRemainingSalesForce: parseInt(quantityRemaining || 0),
          soNumbers: [item.opportunityNumber],
          olNumbers: [item.orderLine]
        }
      }

      reformattedData.push(orgData)
    } else {
      const existingOrgData = {
        ...reformattedData[ficeIndex][fice]
      }

      const { soNumbers, olNumbers } = existingOrgData
      const soIndex = soNumbers.indexOf(opportunityNumber)
      const olIndex = olNumbers.indexOf(orderLine)

      if (soIndex === -1) {
        reformattedData[ficeIndex][fice].soNumbers.push(opportunityNumber)
      }

      if (olIndex === -1) {
        reformattedData[ficeIndex][fice].olNumbers.push(orderLine)
      }

      const orgData = {
        [fice]: {
          ...existingOrgData,
          initialSalesForceQuantity:
            existingOrgData.initialSalesForceQuantity +
            parseFloat(quantity || 0),
          quantityCommittedSalesForce:
            existingOrgData.quantityCommittedSalesForce +
            parseInt(committedVolume || 0),
          quantitySalesForce:
            existingOrgData.quantitySalesForce +
            parseInt(quantitySalesForce || 0),
          quantityDeliveredSalesForce:
            existingOrgData.quantityDeliveredSalesForce +
            parseInt(quantityDelivered || 0),
          quantityRemainingSalesForce:
            existingOrgData.quantityRemainingSalesForce +
            parseInt(quantityRemaining || 0)
        }
      }

      reformattedData[ficeIndex] = {
        ...orgData
      }
    }
  })

  return reformattedData
}
