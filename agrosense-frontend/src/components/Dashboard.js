import { useEffect, useState } from 'react';
import api from '../api';

export default function Dashboard() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get('plans/');
        setPlans(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPlans();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <h3>Planes disponibles:</h3>
      <ul>
        {plans.map(plan => (
          <li key={plan.id}>{plan.name} - ${plan.price}</li>
        ))}
      </ul>
    </div>
  );
}
