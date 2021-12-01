type Props = {
    readonly toggle: () => void;
    name : String
}

function EditPopUp({toggle, name}:Props) {
    const handleClick = () => {
        toggle();
    }
    return (
        <div className="modal">
          <div className="modal_content">
            <span className="close" onClick={handleClick}>
              &times;
            </span>
            <form>
              <h3>Please enter a new event name:</h3>
              <label>
                Name:
                <input type="text" name="name" />
              </label>
              <br />
              <input type="submit" />
            </form>
          </div>
        </div>
    );
};

export default EditPopUp;