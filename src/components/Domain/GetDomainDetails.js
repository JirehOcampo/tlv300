import React, { useState } from "react";

export default function GetDomainDetails() {
  const [domainName, setDomainName] = useState("");
  const [infoType, setInfoType] = useState("domain");
  const [domainInfo, setDomainInfo] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  //Temporary array for host name
  const tempData = [];
  //Temporary count for host name length
  let tempCount = 25;
  //Temporary index of current host name
  let tempIndex = 0;

  async function fetchDomain() {
    console.log("Test1");
    setLoading(true);

    const apiKey = process.env.REACT_APP_API_KEY;
    const baseUrl = process.env.REACT_APP_BASE_URL;

    //fetching data from API
    try {
      const response = await fetch(
        `${baseUrl}?apiKey=${apiKey}&domainName=${domainName}&type=${infoType}&outputFormat=json`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch domain information.");
      }
      const data = await response.json();
      console.log("Test3", data);
      if (data.ErrorMessage) {
        setErrorMsg(data.ErrorMessage.msg);
      }
      setDomainInfo(data);
    } catch (e) {
      setErrorMsg(e.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  //getting value of Domain Information from user input
  function handleChange(e) {
    setDomainName(e.target.value);
  }

  //getting value of Information Type from user selection
  const handleSelectChange = (event) => {
    setInfoType(event.target.value);
  };

  return (
    <div className="container mt-4">
      <h2>Domain Information</h2>
      <div className="mb-3">
        <label htmlFor="domainName" className="form-label">
          Enter Domain Name:
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="ex. google.com"
          id="domainName"
          value={domainName}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="infoType" className="form-label">
          Select Information Type
        </label>
        <select
          className="form-select"
          id="infoType"
          value={infoType}
          onChange={handleSelectChange}
        >
          <option value="domain">Domain Information</option>
          <option value="contact">Contact Information</option>
        </select>
      </div>
      <button className="btn btn-primary" onClick={fetchDomain}>
        Search Domain
      </button>
      {errorMsg && <p className="text-danger mt-2">{errorMsg}</p>}
      {loading && <div>Loading data, please wait</div>}

      {/* If information type is Domain Information */}
      {domainInfo && (
        <div className="mt-4">
          <h3>Results</h3>
          <table className="table">
            <tbody>
              <tr>
                <td>
                  <strong>Domain Name:</strong>
                </td>
                <td>{domainInfo.WhoisRecord?.domainName}</td>
              </tr>
              {infoType === "domain" && (
                <>
                  <tr>
                    <td>
                      <strong>Registrar:</strong>
                    </td>
                    <td>{domainInfo.WhoisRecord?.registrarName}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Registration Date:</strong>
                    </td>
                    <td>{domainInfo.WhoisRecord?.updatedDate}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Estimated Domain Age:</strong>
                    </td>
                    <td>{domainInfo.WhoisRecord?.expiresDate}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Expiration Date:</strong>
                    </td>
                    <td>{domainInfo.WhoisRecord?.estimatedDomainAge}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Host Names:</strong>
                    </td>
                    <td>
                      {/* Characters for host names - 25 characters */}
                      {domainInfo.WhoisRecord?.nameServers.hostNames.map(
                        (domainInfos, index) => {
                          if (tempIndex === index) {
                            if (tempCount === 0) {
                              tempIndex -= 1;
                              return <span> ,...</span>;
                            } else if (domainInfos.length < tempCount) {
                              tempCount -= domainInfos.length;
                              tempIndex += 1;
                              return <span>{domainInfos}, </span>;
                            } else {
                              let tempVar = domainInfos.substr(0, tempCount);
                              tempCount -= domainInfos.substr(
                                0,
                                tempCount
                              ).length;
                              console.log("try 3", tempCount);

                              tempIndex += 1;
                              return <span>{tempVar}</span>;
                            }
                          }
                          console.log("test5", domainInfos.toString().length);
                        }
                      )}
                    </td>
                  </tr>
                </>
              )}

              {/* If information type is Contact Information */}
              {infoType === "contact" && (
                <>
                  <tr>
                    <td>
                      <strong>Registrant Name:</strong>
                    </td>
                    <td>{domainInfo.WhoisRecord?.registrant.organization}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Technical Contact Name:</strong>
                    </td>
                    <td>
                      {domainInfo.WhoisRecord?.technicalContact.organization}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Administrative Contact Name</strong>
                    </td>
                    <td>
                      {
                        domainInfo.WhoisRecord?.administrativeContact
                          .organization
                      }
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Email:</strong>
                    </td>
                    <td>{domainInfo.WhoisRecord?.contactEmail}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
