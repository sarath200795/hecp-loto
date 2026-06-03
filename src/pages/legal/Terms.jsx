import { Link } from 'react-router-dom'
import LegalLayout, { H2 } from './LegalLayout'

export default function Terms() {
  return (
    <LegalLayout title="Terms of Service" updated="2026-06-03">
      <p>
        By creating an account or using HECP LOTO ("the Service") you agree to these Terms, the{' '}
        <Link to="/privacy" className="font-semibold text-amber-600">
          Privacy Policy
        </Link>
        , and the safety disclaimer below.
      </p>

      <H2>Accounts & organizations</H2>
      <p>
        Provide accurate information and keep credentials confidential. Organization admins control
        membership, roles, and permissions and are responsible for authorizing only competent,
        trained personnel. You are responsible for activity under your account.
      </p>

      <H2>Acceptable use</H2>
      <p>
        Do not misuse or disrupt the Service, attempt unauthorized access, upload unlawful or
        malicious content, or rely on the Service as the sole control for hazardous energy. Use must
        comply with all applicable laws and workplace-safety regulations.
      </p>

      <H2>Safety-critical limitations</H2>
      <p>
        The Service assists with LOTO documentation and recordkeeping. <strong>It does not verify
        physical energy isolation and is not a substitute for a compliant energy-control program or
        qualified personnel</strong> (e.g. OSHA 29 CFR 1910.147). You assume full responsibility for
        safe work practices and zero-energy verification at the equipment.
      </p>

      <H2>Warranties & liability</H2>
      <p>
        The Service is provided "as is" and "as available", without warranties of any kind. To the
        maximum extent permitted by law, the authors and operators are not liable for any indirect,
        incidental, special, or consequential damages, or for any injury, death, property damage, or
        regulatory penalty arising from use of the Service. The Service is licensed under the MIT
        License.
      </p>

      <H2>Termination & governing law</H2>
      <p>
        Access may be suspended or terminated for breach of these Terms; audit records may be
        retained as required for safety/legal compliance. These Terms are governed by the laws of
        the operator's stated jurisdiction.
      </p>

      <p className="text-steel-400">
        The complete terms are maintained in the repository's <code>TERMS.md</code> and{' '}
        <code>DISCLAIMER.md</code>.
      </p>
    </LegalLayout>
  )
}
