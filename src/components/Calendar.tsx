import { useState } from "react";

import classes from "./Calendar.module.css";

const LS_KEY = "test_calendar";
const getLsKey = (date?: Date) => {
  return `${LS_KEY}-${date?.getDate()}-${date?.getMonth()}-${date?.getFullYear()}`;
};

function Calendar() {
  const [reference, setReference] = useState<Date>(new Date());
  const days = getAllDaysInMonth(reference.getMonth(), reference.getFullYear());

  const [activeDay, setActiveDay] = useState<Date | undefined>();

  const activeDayLsKey = getLsKey(activeDay);
  const activeDayText = activeDay ? localStorage.getItem(activeDayLsKey) : "";

  const handleActiveDayTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    localStorage.setItem(activeDayLsKey, e.target.value);
  };

  const handleReset = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(LS_KEY)) {
        localStorage.removeItem(key);
      }
    });
  };

  const goToPrevMonth = () => {
    const newReference = new Date(reference);
    if (newReference.getMonth() === 0) {
      newReference.setMonth(11);
      newReference.setFullYear(newReference.getFullYear() - 1);
    } else {
      newReference.setMonth(newReference.getMonth() - 1);
    }
    setReference(newReference);
  };

  const goToNextMonth = () => {
    const newReference = new Date(reference);
    if (newReference.getMonth() === 11) {
      newReference.setMonth(0);
      newReference.setFullYear(newReference.getFullYear() + 1);
    } else {
      newReference.setMonth(newReference.getMonth() + 1);
    }
    setReference(newReference);
  };

  const frontFiller = [];
  let backFiller = [];

  let dummy = new Date(days[0]);
  const frontFillerCount = dummy.getDay() === 0 ? 6 : dummy.getDay() - 1;
  for (let i = 0; i < frontFillerCount; i++) {
    dummy.setDate(dummy.getDate() - 1);
    frontFiller.unshift(new Date(dummy));
  }
  dummy = new Date(days[days.length - 1]);
  for (let i = 0; i < 42 - days.length - frontFiller.length; i++) {
    dummy.setDate(dummy.getDate() + 1);
    backFiller.push(new Date(dummy));
  }
  if (backFiller.length > 7) {
    backFiller = backFiller.slice(0, backFiller.length - 7);
  }

  return (
    <div className={classes.root}>
      <div className={classes.calendar}>
        <div className={classes.month}>
          <button onClick={goToPrevMonth}>{"<"}</button>
          <div>
            <span>
              {reference.toLocaleString("default", { month: "long" })}
            </span>
            {" - "}
            <span>{reference.getFullYear()}</span>
          </div>
          <button onClick={goToNextMonth}>{">"}</button>
        </div>
        <div className={classes.days}>
          <span>Mo</span>
          <span>Tu</span>
          <span>Ww</span>
          <span>Th</span>
          <span>Fr</span>
          <span>Sa</span>
          <span>Su</span>
          {frontFiller.map((day) => (
            <span key={day.toISOString()}>{day.getDate()}</span>
          ))}
          {days.map((day) => (
            <button
              key={day.toISOString()}
              onClick={() => setActiveDay(day)}
              className={
                localStorage.getItem(getLsKey(day))
                  ? classes.withNote
                  : undefined
              }
              style={{
                color:
                  day.toISOString() === activeDay?.toISOString()
                    ? "red"
                    : undefined,
                textDecoration:
                  day.toISOString() === new Date().toISOString()
                    ? "underline"
                    : "",
              }}
            >
              {day.getDate()}
            </button>
          ))}
          {backFiller.map((day) => (
            <span key={day.toISOString()}>{day.getDate()}</span>
          ))}
        </div>
      </div>
      {activeDay && (
        <div className={classes.editor}>
          <textarea
            key={activeDayLsKey}
            rows={6}
            defaultValue={activeDayText || ""}
            onBlur={handleActiveDayTextChange}
          ></textarea>
          <button onClick={handleReset}>Reset All Text</button>
        </div>
      )}
    </div>
  );
}

export default Calendar;

const getAllDaysInMonth = (month: number, year: number) =>
  Array.from(
    { length: new Date(year, month, 0).getDate() },
    (_, i) => new Date(year, month, i + 1)
  );
