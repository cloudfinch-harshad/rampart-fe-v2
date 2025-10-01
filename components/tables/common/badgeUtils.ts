/**
 * Utility functions for badge styling in tables
 */

export type BadgeColorScheme = {
  [key: string]: string
}

/**
 * Get badge color class based on type
 */
export function getBadgeColorClass(
  value: string, 
  colorScheme: BadgeColorScheme,
  defaultClass = "bg-gray-100 text-gray-800 hover:bg-gray-200"
): string {
  return colorScheme[value] || defaultClass
}

/**
 * Common color schemes for different entity types
 */
export const commonColorSchemes = {
  // Company types
  companyTypes: {
    "Importer": "bg-blue-100 text-blue-800 hover:bg-blue-200",
    "Exporter": "bg-purple-100 text-purple-800 hover:bg-purple-200",
    "Buying House": "bg-amber-100 text-amber-800 hover:bg-amber-200",
    "Customs Broker": "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
    "Forwarder": "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
    "Counterpart": "bg-rose-100 text-rose-800 hover:bg-rose-200",
    "Liner Agent/Carrier/NVOCC": "bg-blue-100 text-blue-800 hover:bg-blue-200",
    "Notify Party": "bg-green-100 text-blue-800 hover:bg-blue-200"
  },
  
  // Status colors
  status: {
    "Active": "bg-green-100 text-green-800 hover:bg-green-200 border-transparent",
    "Inactive": "bg-red-100 text-red-800 hover:bg-red-200 border-transparent",
    "Pending": "bg-amber-100 text-amber-800 hover:bg-amber-200 border-transparent",
    "Suspended": "bg-orange-100 text-orange-800 hover:bg-orange-200 border-transparent"
  },

  // Shipment status colors
  shipmentStatus: {
    "": "bg-black text-white hover:bg-black border-transparent",
    "Delivered": "bg-green-100 text-green-800 hover:bg-green-200 border-transparent",
    "": "bg-red-100 text-red-800 hover:bg-red-200 border-transparent",
    "In Transit": "bg-amber-100 text-amber-800 hover:bg-amber-200 border-transparent",
    "Origin Handling": "bg-gray-100 text-gray-800 hover:bg-gray-200 border-transparent",
  },
  
  
  // Filter badge colors
  filterBadges: {
    country: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    type: "bg-purple-50 text-purple-700 hover:bg-purple-100",
    status: "bg-amber-50 text-amber-700 hover:bg-amber-100",
    portType: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    carrier: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
    flagCountry: "bg-rose-50 text-rose-700 hover:bg-rose-100",
    // Container properties
    size: "bg-cyan-50 text-cyan-700 hover:bg-cyan-100",
    
    // Codes and Operators properties
    category: "bg-violet-50 text-violet-700 hover:bg-violet-100",
    usedIn: "bg-fuchsia-50 text-fuchsia-700 hover:bg-fuchsia-100",
    // HS Codes properties
    commodityType: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    hazardous: "bg-red-50 text-red-700 hover:bg-red-100",
    temperatureControlled: "bg-green-50 text-green-700 hover:bg-green-100",
    // Incoterms properties
    termCode: "bg-sky-50 text-sky-700 hover:bg-sky-100",
    riskTransferPoint: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    // Routes properties
    originPort: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
    destinationPort: "bg-purple-50 text-purple-700 hover:bg-purple-100",
    mode: "bg-violet-50 text-violet-700 hover:bg-violet-100",
    // Vessels properties
    carrierName: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
    imoNumber: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    // Transport Hubs properties
    subType: "bg-fuchsia-50 text-fuchsia-700 hover:bg-fuchsia-100",
    customs: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
  }
}
