let csrfToken;

const handleDomo = (e) => {
  e.preventDefault();

  $("#domoMessage").animate({ width: 'hide' }, 350);

  if ($("#domoName").val() == '' || $("#domoAge") == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax('POST', $("#domoForm").attr('action'), $("#domoForm").serialize(), function () {
    loadDomosFromServer();
  });

  return false;
};

const deleteDomo = (id) => {
  console.log("Deleting domo");
  const data = `id=${id}&_csrf=${csrfToken}`;
  sendAjax('DELETE', '/deleteDomo', data, () => {
    loadDomosFromServer();
  });
};

const DomoForm = (props) => {
  return (
    <form id='domoForm' name='domoForm' onSubmit={handleDomo} action='/maker' method='POST' className='domoForm'>
      <label htmlFor='name'>Name: </label>
      <input id='domoName' type='text' name='name' placeholder='Domo Name' />
      <label htmlFor='age'>Age: </label>
      <input id='domoAge' type='text' name='age' placeholder='Domo Age' />
      <label htmlFor='height'>Height: </label>
      <input id='domoHeight' type='number' name='height' placeholder='Enter domo height (in cm)' required />
      <input type='hidden' name='_csrf' value={props.csrf} />
      <input className='makeDomoSubmit' type='submit' value='Make Domo' />
    </form>
  )
}

const DomoList = function (props) {
  if (props === undefined || props.domos.length === 0) {
    return (
      <div className='domoList'>
        <h3 className='emptyDomo'>No Domos yet</h3>
      </div>
    );
  }

  const domoNodes = props.domos.map(function (domo) {
    return (
      <div key={domo._id} className='domo'>
        <img src='/assets/img/domoface.jpeg' alt='domo face' className='domoFace' />
        <h3 className='domoName'> Name: {domo.name} </h3>
        <h3 className='domoAge'> Age: {domo.age} </h3>
        <h3 className='domoHeight'> Height: {domo.height}</h3>
        <i className="fa fa-trash" aria-hidden="true" onClick={() => deleteDomo(domo._id)}></i>
      </div>
    );
  });

  return (
    <div className='domoList'>
      {domoNodes}
    </div>
  );
};

const loadDomosFromServer = () => {
  sendAjax('GET', '/getDomos', null, (data) => {
    ReactDOM.render(
      <DomoList domos={data.domos} />, document.querySelector("#domos")
    );
  });
};

const setup = function (csrf) {
  csrfToken = csrf;

  ReactDOM.render(
    <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
  );

  ReactDOM.render(
    <DomoList domos={[]} />, document.querySelector("#domos")
  );

  loadDomosFromServer();
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
})