'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Globe, Hash, Server, MapPin, Flag, Building, Map } from 'lucide-react'

interface IPInfo {
  ip?: string
  as?: {
    number?: number
    name?: string
    info?: string
  }
  addr?: string
  location?: {
    latitude?: number
    longitude?: number
  }
  country?: {
    code?: string
    name?: string
  }
  registered_country?: {
    code?: string
    name?: string
  }
  regions?: string[]
}

export default function Home() {
  const [ipAddress, setIpAddress] = useState('')
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchIPInfo()
  }, [])

  const fetchIPInfo = async (ip: string = '') => {
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch(`https://blog.9sd.top/api/ip/index.php?ip=${ip}`)
      if (!response.ok) {
        throw new Error('Failed to fetch IP information')
      }
      const data = await response.json()
      setIpInfo(data)
    } catch (err) {
      setError('Error fetching IP information. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchIPInfo(ipAddress)
  }

  const InfoItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
      <Icon className="w-5 h-5 text-gray-500" />
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-sm font-semibold break-all">{value}</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Eray IP Query</CardTitle>
          <CardDescription className="text-center">输入IP地址或查看您当前的IP信息</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Input
                type="text"
                placeholder="输入IP地址"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : '查询'}
              </Button>
            </div>
          </form>

          {error && <p className="text-red-500 mt-4">{error}</p>}

          {ipInfo && !isLoading && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">IP信息如下:</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoItem icon={Globe} label="IP地址" value={ipInfo.ip || 'N/A'} />
                <InfoItem icon={Hash} label="AS编号" value={ipInfo.as?.number?.toString() || 'N/A'} />
                <InfoItem icon={Server} label="AS名称" value={ipInfo.as?.name || 'N/A'} />
                <InfoItem icon={Server} label="AS信息" value={ipInfo.as?.info || 'N/A'} />
                <InfoItem icon={MapPin} label="地址范围" value={ipInfo.addr || 'N/A'} />
                <InfoItem icon={MapPin} label="经纬度" value={`${ipInfo.location?.latitude || 'N/A'}, ${ipInfo.location?.longitude || 'N/A'}`} />
                <InfoItem icon={Flag} label="国家" value={ipInfo.country ? `${ipInfo.country.name} (${ipInfo.country.code})` : 'N/A'} />
                <InfoItem icon={Building} label="注册国家" value={ipInfo.registered_country ? `${ipInfo.registered_country.name} (${ipInfo.registered_country.code})` : 'N/A'} />
                <InfoItem icon={Map} label="地区" value={ipInfo.regions && ipInfo.regions.length > 0 ? ipInfo.regions.join(', ') : 'N/A'} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
