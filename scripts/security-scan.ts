#!/usr/bin/env ts-node

import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const execAsync = promisify(exec)

interface SecurityIssue {
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  file?: string
  line?: number
  recommendation: string
}

class SecurityScanner {
  private issues: SecurityIssue[] = []

  async scan(): Promise<SecurityIssue[]> {
    console.log('🔍 Starting security scan...')

    await this.checkDependencies()
    await this.checkEnvironmentVariables()
    await this.checkFilePermissions()
    await this.checkCodeVulnerabilities()
    await this.checkDatabaseSecurity()

    return this.issues
  }

  private async checkDependencies(): Promise<void> {
    console.log('📦 Checking dependencies...')

    try {
      const { stdout } = await execAsync('npm audit --json')
      const auditResult = JSON.parse(stdout)

      if (auditResult.metadata.vulnerabilities > 0) {
        this.issues.push({
          severity: 'high',
          title: 'Vulnerable Dependencies',
          description: `${auditResult.metadata.vulnerabilities} vulnerable dependencies found`,
          recommendation: 'Run npm audit fix or update vulnerable packages'
        })
      }
    } catch (error) {
      this.issues.push({
        severity: 'medium',
        title: 'Dependency Audit Failed',
        description: 'Could not check for vulnerable dependencies',
        recommendation: 'Ensure npm audit runs successfully'
      })
    }
  }

  private async checkEnvironmentVariables(): Promise<void> {
    console.log('🔐 Checking environment variables...')

    const envPath = path.join(process.cwd(), '.env')
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8')

      // Check for hardcoded secrets
      if (envContent.includes('password') || envContent.includes('secret') || envContent.includes('key')) {
        // This is expected, but we should warn about committing .env files
        if (fs.existsSync(path.join(process.cwd(), '.env'))) {
          this.issues.push({
            severity: 'high',
            title: 'Environment File in Repository',
            description: '.env file should not be committed to version control',
            recommendation: 'Add .env to .gitignore and use .env.example instead'
          })
        }
      }
    } else {
      this.issues.push({
        severity: 'medium',
        title: 'Missing Environment File',
        description: 'No .env file found',
        recommendation: 'Create .env file with required environment variables'
      })
    }
  }

  private async checkFilePermissions(): Promise<void> {
    console.log('📁 Checking file permissions...')

    const sensitiveFiles = [
      'prisma/schema.prisma',
      'lib/auth.ts',
      'lib/database.ts',
      'scripts/seed-admin.ts'
    ]

    for (const file of sensitiveFiles) {
      const filePath = path.join(process.cwd(), file)
      if (fs.existsSync(filePath)) {
        // In a real implementation, you'd check actual file permissions
        // For now, just check if files contain sensitive data
        const content = fs.readFileSync(filePath, 'utf8')
        if (content.includes('password') || content.includes('secret')) {
          this.issues.push({
            severity: 'medium',
            title: 'Sensitive Data in Code',
            description: `File ${file} contains sensitive information`,
            file,
            recommendation: 'Move sensitive data to environment variables'
          })
        }
      }
    }
  }

  private async checkCodeVulnerabilities(): Promise<void> {
    console.log('💻 Checking code vulnerabilities...')

    // Check for common security issues
    const files = this.getAllSourceFiles()

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8')
      const lines = content.split('\n')

      lines.forEach((line, index) => {
        // Check for eval usage
        if (line.includes('eval(')) {
          this.issues.push({
            severity: 'high',
            title: 'Use of eval()',
            description: 'eval() function usage detected',
            file,
            line: index + 1,
            recommendation: 'Avoid using eval() as it can execute malicious code'
          })
        }

        // Check for innerHTML usage
        if (line.includes('innerHTML') && !line.includes('textContent')) {
          this.issues.push({
            severity: 'medium',
            title: 'Potential XSS via innerHTML',
            description: 'innerHTML usage detected',
            file,
            line: index + 1,
            recommendation: 'Use textContent or sanitize HTML input'
          })
        }

        // Check for console.log in production (exclude security scan script itself)
        if (line.includes('console.log') && !file.includes('test') && !file.includes('security-scan.ts')) {
          this.issues.push({
            severity: 'low',
            title: 'Console.log in Production',
            description: 'console.log statements found',
            file,
            line: index + 1,
            recommendation: 'Remove console.log statements before production'
          })
        }
      })
    }
  }

  private async checkDatabaseSecurity(): Promise<void> {
    console.log('🗄️ Checking database security...')

    const schemaPath = path.join(process.cwd(), 'prisma/schema.prisma')
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8')

      // Check for plain text passwords (simplified check)
      if (schema.includes('password') && !schema.includes('@db.VarChar')) {
        this.issues.push({
          severity: 'high',
          title: 'Plain Text Password Storage',
          description: 'Password fields may not be properly hashed',
          file: 'prisma/schema.prisma',
          recommendation: 'Ensure passwords are hashed using bcrypt or similar'
        })
      }
    }
  }

  private getAllSourceFiles(): string[] {
    const files: string[] = []

    function scanDir(dir: string) {
      const items = fs.readdirSync(dir)

      for (const item of items) {
        const fullPath = path.join(dir, item)
        const stat = fs.statSync(fullPath)

        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          scanDir(fullPath)
        } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx') || item.endsWith('.js') || item.endsWith('.jsx'))) {
          files.push(fullPath)
        }
      }
    }

    scanDir(process.cwd())
    return files
  }

  static formatIssues(issues: SecurityIssue[]): string {
    const severityColors = {
      low: '🟢',
      medium: '🟡',
      high: '🔴',
      critical: '💀'
    }

    let output = '🔍 Security Scan Results\n\n'

    const grouped = issues.reduce((acc, issue) => {
      if (!acc[issue.severity]) acc[issue.severity] = []
      acc[issue.severity].push(issue)
      return acc
    }, {} as Record<string, SecurityIssue[]>)

    for (const [severity, severityIssues] of Object.entries(grouped)) {
      output += `${severityColors[severity as keyof typeof severityColors]} ${severity.toUpperCase()}: ${severityIssues.length} issues\n`

      severityIssues.forEach(issue => {
        output += `  • ${issue.title}\n`
        output += `    ${issue.description}\n`
        if (issue.file) {
          output += `    File: ${issue.file}${issue.line ? `:${issue.line}` : ''}\n`
        }
        output += `    💡 ${issue.recommendation}\n\n`
      })
    }

    return output
  }
}

// CLI runner
async function main() {
  const scanner = new SecurityScanner()
  const issues = await scanner.scan()

  console.log(SecurityScanner.formatIssues(issues))

  if (issues.length === 0) {
    console.log('✅ No security issues found!')
    process.exit(0)
  } else {
    const criticalIssues = issues.filter(i => i.severity === 'critical').length
    const highIssues = issues.filter(i => i.severity === 'high').length

    if (criticalIssues > 0 || highIssues > 0) {
      console.log(`❌ Found ${criticalIssues} critical and ${highIssues} high severity issues`)
      process.exit(1)
    } else {
      console.log(`⚠️ Found ${issues.length} security issues`)
      process.exit(0)
    }
  }
}

const __filename = fileURLToPath(import.meta.url)
if (process.argv[1] === __filename) {
  main().catch(console.error)
}

export { SecurityScanner }