export function buildAttendanceEmail({ className, date, students }) {
  const present = students.filter(s => s.status === 'Presente');
  const absent = students.filter(s => s.status === 'Faltante');

  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="text-align: center; color: #007BFF;">Relatório de Presença</h2>
      <p><strong>Turma:</strong> ${className}</p>
      <p><strong>Data:</strong> ${date}</p>

      <h3 style="color: green;">✅ Alunos Presentes</h3>
      <table width="100%" border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse;">
        <tr style="background-color: #e8f5e9;">
          <th align="left">Nomes</th>
        </tr>
        ${present.map(s => `
          <tr>
            <td>${s.name}</td>
          </tr>
        `).join('')}
      </table>

      <h3 style="color: red; margin-top: 20px;">❌ Alunos Faltantes</h3>
      <table width="100%" border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse;">
        <tr style="background-color: #ffebee;">
          <th align="left">Nomes</th>
        </tr>
        ${absent.map(s => `
          <tr>
            <td>${s.name}</td>
          </tr>
        `).join('')}
      </table>

      <p style="margin-top: 30px; text-align: center; color: #555;">
        Enviado automaticamente pelo WizTeacher.
      </p>
    </div>
  `;
}