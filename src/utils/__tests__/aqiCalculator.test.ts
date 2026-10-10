import { calculateExposureScore } from '../aqiCalculator';
import { UserProfile } from '../../types';

export function runAqiCalculationsAudit() {
  const mockProfile: UserProfile = {
    name: 'Test Runner',
    age: 25,
    healthConditions: ['None'],
    commuteMode: 'walking',
    sensitivityLevel: 'normal',
    dailyOutdoorGoalMinutes: 45,
  };

  const goodScore = calculateExposureScore(45, 30, 'Walking', mockProfile);
  console.assert(goodScore.score < 35, 'Good AQI should yield low exposure score');

  const severeScore = calculateExposureScore(350, 60, 'Running', mockProfile);
  console.assert(severeScore.score > 60, 'High exertion in severe AQI should yield high risk score');

  return true;
}
