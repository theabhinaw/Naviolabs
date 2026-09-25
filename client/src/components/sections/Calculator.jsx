import { useMemo, useState } from 'react';
import SectionHead from '../ui/SectionHead.jsx';
import { formatInr, formatInrCompact, roundTo } from '../../utils/format.js';

// Assumption: automation covers 40 to 70 percent of repetitive work.
const LOW_SHARE = 0.4;
const HIGH_SHARE = 0.7;
const WEEKS_PER_MONTH = 4.33;

export default function Calculator({ onGetRealNumber }) {
  const [hours, setHours] = useState(6);
  const [people, setPeople] = useState(3);
  const [cost, setCost] = useState(400);

  const result = useMemo(() => {
    const monthlyHours = hours * people * WEEKS_PER_MONTH;
    const hoursLow = monthlyHours * LOW_SHARE;
    const hoursHigh = monthlyHours * HIGH_SHARE;
    const moneyLow = roundTo(hoursLow * cost, 100);
    const moneyHigh = roundTo(hoursHigh * cost, 100);
    return {
      hours: `${Math.round(hoursLow)} to ${Math.round(hoursHigh)} hours`,
      money: `${formatInr(moneyLow)} to ${formatInr(moneyHigh)}`,
      year: `${formatInrCompact(moneyLow * 12)} to ${formatInrCompact(moneyHigh * 12)}`,
    };
  }, [hours, people, cost]);

  const handleGetNumber = (event) => {
    event.preventDefault();
    onGetRealNumber({
      service: 'Not sure yet',
      message: `Hi Navio Labs, about ${people} ${people === 1 ? 'person spends' : 'people spend'} around ${hours} ${
        hours === 1 ? 'hour' : 'hours'
      } a week on repetitive tasks in our team. I would like a free workflow audit to find out what can be automated.`,
    });
  };

  return (
    <section className="section" id="savings" aria-labelledby="savings-title">
      <div className="wrap">
        <SectionHead id="savings-title" title={<>See what automation could <span className="cursive-highlight" style={{ color: 'var(--cobalt)' }}>give back</span></>}>
          Move the sliders to match your team. The estimate updates as you go.
        </SectionHead>

        <div className="calc">
          <div className="calc-inputs">
            <div className="field-row">
              <label htmlFor="calc-hours">
                <span>Hours per person each week on repetitive tasks</span>
                <output htmlFor="calc-hours">
                  {hours} {hours === 1 ? 'hour' : 'hours'}
                </output>
              </label>
              <input id="calc-hours" type="range" min="1" max="30" step="1" value={hours} onChange={(e) => setHours(Number(e.target.value))} />
            </div>
            <div className="field-row">
              <label htmlFor="calc-people">
                <span>People doing these tasks</span>
                <output htmlFor="calc-people">
                  {people} {people === 1 ? 'person' : 'people'}
                </output>
              </label>
              <input id="calc-people" type="range" min="1" max="25" step="1" value={people} onChange={(e) => setPeople(Number(e.target.value))} />
            </div>
            <div className="field-row">
              <label htmlFor="calc-cost">
                <span>Average cost of one hour of their time</span>
                <output htmlFor="calc-cost">{formatInr(cost)}</output>
              </label>
              <input id="calc-cost" type="range" min="100" max="3000" step="50" value={cost} onChange={(e) => setCost(Number(e.target.value))} />
            </div>
          </div>

          <div className="calc-result">
            <p className="res-label">You could get back about</p>
            <p className="result-big">{result.hours}</p>
            <p className="res-label">every month, worth roughly</p>
            <p className="result-big">{result.money}</p>
            <p className="res-year">
              That is around <strong>{result.year}</strong> a year.
            </p>
            <p className="res-fine">
              A rough guide. It assumes automation covers 40 to 70 percent of repetitive work. The free audit gives you a real figure for your business.
            </p>
            <a className="btn btn-light" href="#contact" onClick={handleGetNumber}>
              Get my real number
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
