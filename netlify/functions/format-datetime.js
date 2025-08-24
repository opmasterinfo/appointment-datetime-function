exports.handler = async (event) => {
  const { appointment_datetime, appointment_duration_in_minutes } = JSON.parse(event.body);

  const durationInMinutes = parseInt(appointment_duration_in_minutes);
  
  let appointmentDateTime, appointmentDate, appointmentTime, timeMin, timeMax;

  // The timezone is always -04:00 for New York
  const fixedTimezoneOffset = '-04:00';

  // Check if the appointment datetime string ends with 'T00:00:00' to identify a date-only input.
  if (appointment_datetime.endsWith('T00:00:00')) {
    // Case 2: appointment_datetime is effectively a date-only input
    const appointmentDateOnly = appointment_datetime.split('T')[0];

    appointmentDateTime = `${appointmentDateOnly}T00:00:00${fixedTimezoneOffset}`;
    appointmentDate = appointmentDateOnly;
    appointmentTime = "";
    timeMin = `${appointmentDateOnly}T00:00:00${fixedTimezoneOffset}`;
    timeMax = `${appointmentDateOnly}T23:59:59${fixedTimezoneOffset}`;

  } else {
    // Case 1: appointment_datetime includes a specific time and timezone
    const apptDt = new Date(appointment_datetime);
    const timeMaxDt = new Date(apptDt.getTime() + durationInMinutes * 60000);

    appointmentDateTime = `${appointment_datetime}${fixedTimezoneOffset}`;
    appointmentDate = appointment_datetime.split('T')[0];
    appointmentTime = appointment_datetime.split('T')[1].slice(0, 8); // Extracts 'HH:mm:ss'
    timeMin = `${appointment_datetime}${fixedTimezoneOffset}`;
    timeMax = `${timeMaxDt.toISOString().slice(0, 19)}${fixedTimezoneOffset}`;
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
