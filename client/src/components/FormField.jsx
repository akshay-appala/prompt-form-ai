import "./FormField.css";

function FormField({ field }) {
  const { label, type, required, placeholder, options } = field;

  return (
    <div className="preview-field">
      <label>
        {label}
        {!label.endsWith("?") && ":"}
        {required && " *"}
      </label>

      {type === "textarea" ? (
        <textarea placeholder={placeholder} required={required} />
      ) : type === "select" ? (
        <select required={required}>
          <option value="">Select an option</option>

          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : type === "radio" ? (
        <div>
          {options.map((option, index) => (
            <label key={index}>
              <input
                type="radio"
                name={label}
                value={option}
                required={required && index === 0}
              />
              {option}
            </label>
          ))}
        </div>
      ) : type === "checkbox" ? (
        <div>
          {options.map((option, index) => (
            <label key={index}>
              <input type="checkbox" value={option} />
              {option}
            </label>
          ))}
        </div>
      ) : (
        <input type={type} placeholder={placeholder} required={required} />
      )}
    </div>
  );
}

export default FormField;
