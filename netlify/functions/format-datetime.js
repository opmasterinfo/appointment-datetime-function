exports.handler = async (event) => {
  const { current_datetime, appointment_datetime, appointment_duration_in_minutes } = JSON.parse(event.body);

  const durationInMinutes = parseInt(appointment_duration_in_minutes);

  let appointmentDateTime, appointmentDate, appointmentTime, timeMin, timeMax;

  // Check if the appointment datetime string ends with 'T00:00:00' to identify a date-only input.
  if (appointment_datetime.endsWith('T00:00:00')) {
    // Case 2: appointment_datetime is effectively a date-only input
    const appointmentDateOnly = appointment_datetime.split('T')[0];
    const timezone = current_datetime.slice(current_datetime.indexOf('T') + 1);

    appointmentDateTime = `${appointmentDateOnly}T00:00:00${timezone}`;
    appointmentDate = appointmentDateOnly;
    appointmentTime = "";
    timeMin = `${appointmentDateOnly}T00:00:00${timezone}`;
    timeMax = `${appointmentDateOnly}T23:59:59${timezone}`;

  } else {
    // Case 1: appointment_datetime includes a specific time and timezone
    const apptDt = new Date(appointment_datetime);
    const timeMaxDt = new Date(apptDt.getTime() + durationInMinutes * 60000);

    appointmentDateTime = appointment_datetime;
    appointmentDate = appointment_datetime.split('T')[0];
    appointmentTime = appointment_datetime.split('T')[1].slice(0, 8); // Extracts 'HH:mm:ss'
    timeMin = appointment_datetime;
    timeMax = timeMaxDt.toISOString();
  }

  const responseBody = {
    appointmentDateTime,
    appointmentDate,
    appointmentTime,
    appointmentDuration: appointment_duration_in_minutes,
    timeMin,
    timeMax
  };

  return {
    statusCode: 200,
    body: JSON.stringify(responseBody),
  };
};
