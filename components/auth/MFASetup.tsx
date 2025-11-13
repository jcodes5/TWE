"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Smartphone, Key } from "lucide-react"
import { SecurityService } from "@/lib/security"

interface MFASetupProps {
  onComplete: (secret: string) => void
  onCancel: () => void
}

export default function MFASetup({ onComplete, onCancel }: MFASetupProps) {
  const [step, setStep] = useState<'setup' | 'verify'>('setup')
  const [secret, setSecret] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [error, setError] = useState('')

  const handleSetup = () => {
    const mfaData = SecurityService.generateMFASecret()
    setSecret(mfaData.secret)
    setQrCodeUrl(mfaData.otpauth)
    setStep('verify')
  }

  const handleVerify = async () => {
    if (!SecurityService.verifyMFAToken(secret, verificationCode)) {
      setError('Invalid verification code')
      return
    }

    onComplete(secret)
  }

  if (step === 'setup') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full w-fit">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle>Enable Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your admin account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Authenticator App</p>
                <p className="text-xs text-muted-foreground">Use Google Authenticator or similar</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <Key className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Backup Codes</p>
                <p className="text-xs text-muted-foreground">Generated after setup</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Skip for Now
            </Button>
            <Button onClick={handleSetup} className="flex-1">
              Set Up MFA
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-green-100 dark:bg-green-900/20 rounded-full w-fit">
          <Smartphone className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <CardTitle>Verify Your Authenticator</CardTitle>
        <CardDescription>
          Scan the QR code with your authenticator app and enter the 6-digit code
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">QR Code would be displayed here</p>
          <p className="text-xs font-mono break-all">{qrCodeUrl}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">Verification Code</Label>
          <Input
            id="code"
            type="text"
            placeholder="000000"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            maxLength={6}
            className="text-center text-lg tracking-widest"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setStep('setup')} className="flex-1">
            Back
          </Button>
          <Button onClick={handleVerify} disabled={verificationCode.length !== 6} className="flex-1">
            Verify & Enable
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}