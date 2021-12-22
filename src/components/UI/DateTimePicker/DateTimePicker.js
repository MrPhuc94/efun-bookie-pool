import React, { forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./styles.scss";
import ic_date from "src/assets/images/ic_date/ic_date.png";
import ic_time from "src/assets/images/ic_time/ic_time.png";

const DateTimePicker = ({ type, value, onChange }) => {
  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) =>
    type === "date" ? (
      <button className="date-custom-input" onClick={onClick} ref={ref}>
        <img width="20" height="20" src={ic_date} alt="date" />
        {value ? value : "Date"}
      </button>
    ) : (
      <button className="date-custom-input" onClick={onClick} ref={ref}>
        <img width="20" height="20" src={ic_time} alt="hour" />
        {value ? value : "Hour"}
      </button>
    )
  );
  return (
    <DatePicker
      selected={value}
      onChange={onChange && onChange}
      timeInputLabel="Time:"
      dateFormat="MM/dd/yyyy h:mm aa"
      customInput={<ExampleCustomInput />}
      showTimeInput
      popperModifiers={{
        preventOverflow: {
          enabled: true,
        },
        style: {
          textAlign: "center",
          justifyContent: "center",
        },
      }}
    />
  );
};

export default DateTimePicker;
