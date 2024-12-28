import "./Instructions.css";

export default function Instructions(props:any) {
  return (
    <div class="instruction-wrapper">
      <div class="instruction-header">
        <h1 class="title">Special Contact Instructions</h1>
      </div>

      <h2 class="section">General Guidelines</h2>
      <p>Use phone during school hours (8:00 AM - 3:30 PM). Use email for non-urgent matters after hours. Escalate high-risk incidents to the principal or vice-principal.</p>

      <h2 class="section">Time-Based Instructions</h2>
      <ul>
        <li>
          <strong>During School Hours:</strong> Contact the school counselor for mental health or bullying tips. Notify the SRO for threats, weapons, or substance abuse. Call the front office at <strong>(XXX) XXX-XXXX</strong> for immediate safety risks.
        </li>
        <li>
          <strong>After School Hours:</strong> Email the after-school coordinator for non-critical issues. Call the emergency hotline at <strong>(XXX) XXX-YYYY</strong> for urgent matters.
        </li>
        <li>
          <strong>Evenings/Nights:</strong> Escalate emergencies to the district crisis team at <strong>(XXX) XXX-ZZZZ</strong>. Log non-urgent tips for follow-up.
        </li>
      </ul>

      <h2 class="section">Day-Based Instructions</h2>
      <ul>
        <li><strong>Weekdays:</strong> Follow time-based instructions.</li>
        <li><strong>Weekends/Holidays:</strong> Use the district emergency contact system for critical incidents. Notify local law enforcement if unavailable.</li>
      </ul>

      <h2 class="section">Tip Type Instructions</h2>
      <ul>
        <li>
          <strong>Threats:</strong> Call the principal's direct line at <strong>(XXX) XXX-AAAA</strong> and the SRO at <strong>(XXX) XXX-BBBB</strong>. Follow up at <strong>violencetips@brightfutureacademy.edu</strong>.
        </li>
        <li>
          <strong>Self-Harm:</strong> Notify the school counselor or district crisis intervention team.
        </li>
        <li>
          <strong>Bullying:</strong> Contact <strong>antibullying@brightfutureacademy.edu</strong>. Escalate urgent cases to the principal.
        </li>
        <li>
          <strong>Substance Abuse/Vandalism:</strong> Report to the dean of students during school hours. Email administration after hours.
        </li>
      </ul>

      <h2 class="section border">Additional Notes</h2>
      <p class="note">Document all contact attempts in the tip management system. Escalate to the district superintendent for conflicting priorities.</p>
    </div>
  )
}