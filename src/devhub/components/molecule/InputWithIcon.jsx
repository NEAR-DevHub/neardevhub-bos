const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;
`;
const value = props.value;
const [input, setInput] = useState(value);
const onUpdate = props.onUpdate ?? (() => {});
const onEnter = props.onEnter ?? (() => {});

useEffect(() => {
  if (input !== value) {
    setInput(value);
  }
}, [value]);

const updateInput = (v) => setInput(v);

useEffect(() => {
  if (input !== value) {
    onUpdate(input);
  }
}, [input]);

return (
  <InputContainer>
    <div className="position-absolute d-flex ps-3 flex-column h-100 justify-center">
      {props.icon}
    </div>
    <input
      type="text"
      className="ps-5 form-control border rounded-2"
      value={input}
      onChange={(e) => updateInput(e.target.value)}
      onKeyDown={(e) => e.key == "Enter" && onEnter()}
      placeholder={props.placeholder}
    />
  </InputContainer>
);
