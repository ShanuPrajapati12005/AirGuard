export interface TelemetryAnomaly {
  field: string;
  value: number;
  expectedRange: [number, number];
  severity: 'warning' | 'critical';
  message: string;
}

export function validateSensorReading(reading: {
  pm25: number;
  pm10: number;
  temperature: number;
  humidity: number;
}): TelemetryAnomaly[] {
  const anomalies: TelemetryAnomaly[] = [];

  if (reading.pm25 < 0 || reading.pm25 > 999) {
    anomalies.push({
      field: 'pm25',
      value: reading.pm25,
      expectedRange: [0, 500],
      severity: 'critical',
      message: 'PM2.5 reading outside valid optical measurement range',
    });
  }

  if (reading.temperature < -20 || reading.temperature > 65) {
    anomalies.push({
      field: 'temperature',
      value: reading.temperature,
      expectedRange: [-10, 50],
      severity: 'warning',
      message: 'Ambient temperature sensor exceeds expected meteorological limits',
    });
  }

  if (reading.humidity < 0 || reading.humidity > 100) {
    anomalies.push({
      field: 'humidity',
      value: reading.humidity,
      expectedRange: [0, 100],
      severity: 'critical',
      message: 'Relative humidity saturation invalid',
    });
  }

  return anomalies;
}
