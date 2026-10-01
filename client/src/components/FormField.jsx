import "./FormField.css";

function FormField({ field, onChange, onValueChange }) {
  const { label, type, required, placeholder, options } = field;

  return (
    <div className="preview-field">
      {onChange && (
        <div className="field-editor">
          <label htmlFor={`field-label-${field._id || label}`}>
            Edit Field Label
          </label>

          <input
            id={`field-label-${field._id || label}`}
            type="text"
            value={label}
            onChange={(event) => onChange({ label: event.target.value })}
          />
        </div>
      )}
      <label>
        {label}
        {!label.endsWith("?") && ":"}
        {required && " *"}
      </label>

      {type === "textarea" ? (
        <textarea
          placeholder={placeholder}
          required={required}
          onChange={(event) => onValueChange?.(event.target.value)}
        />
      ) : type === "select" ? (
        <select
          required={required}
          onChange={(event) => onValueChange?.(event.target.value)}
        >
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
                onChange={(event) => onValueChange?.(event.target.value)}
              />
              {option}
            </label>
          ))}
        </div>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          required={required}
          onChange={(event) => onValueChange?.(event.target.value)}
        />
      )}
    </div>
  );
}

export default FormField;
