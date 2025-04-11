import { Radio } from "@mui/material";
import CSCSelector from "./CSCSelector/CSCSelector";
import { userProfileContext } from "../../contexts/UserProfileContext";
import Navigation from "../navigation/Navigation";
import React, {
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import SearchSkills from "./SearchSkills/SearchSkills";
import { useNavigate } from "react-router-dom";
import style from "./Search.module.css";
import { qualificationsList } from "../../constants/data";

const avatarURL = "/assets/avatar.png";

export default function Search() {
  const navigate = useNavigate();
  const contractorList = useContext(userProfileContext).contractors;
  const [contractors, setContractors] = useState([]);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = React.useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedQualification, setSelectedQualification] = useState([]);

  const filterContractors = useCallback(() => {
    const calculatePercentMatching = (contractor) => {
      if (selectedSkills.length === 0) return "";
      const matchingSkills = contractor.skills.filter((skill) =>
        selectedSkills.includes(skill.skill)
      ).length;

      return Math.round((matchingSkills / selectedSkills.length) * 100);
    };
    return contractorList
      .filter(
        (contractor) =>
          contractor.availability === "Full Time" ||
          contractor.availability === "Part Time"
      )
      .filter(
        (contractor) =>
          selectedQualification.length === 0 ||
          selectedQualification.includes(contractor.qualification)
      )
      .filter((contractor) => {
        if (selectedSkills.length === 0) return true;
        return contractor.skills.some((skill) =>
          selectedSkills.includes(skill.skill)
        );
      })
      .filter((contractor) => {
        if (!country && !state && !city) return true;
        const matchingLocation = contractor.location.toLowerCase();

        return (
          (!country || matchingLocation.includes(country.toLowerCase())) &&
          (!state || matchingLocation.includes(state.toLowerCase())) &&
          (!city || matchingLocation.includes(city.toLowerCase()))
        );
      })
      .map((contractor) => ({
        ...contractor,
        percentMatching: calculatePercentMatching(contractor),
      }));
  }, [
    contractorList,
    selectedSkills,
    selectedQualification,
    country,
    state,
    city,
  ]);

  useEffect(() => {
    setContractors(filterContractors());
  }, [contractorList, filterContractors]);

  const memoizedSearchState = useMemo(
    () => ({
      selectedQualification,
      selectedSkills,
      country,
      state,
      city,
    }),
    [selectedSkills, selectedQualification, country, state, city]
  );

  const handleOptionQualificationChange = (option) => {
    setSelectedQualification(
      selectedQualification.includes(option) ? [] : [option]
    );
    setSelectedSkills([]);
  };

  const handleClearAll = () => {
    setSelectedQualification([]);

    setSelectedSkills([]);

    setCountry("");
    setState("");
    setCity("");

    setContractors([]);
  };

  const handleSearch = () => {
    setContractors(filterContractors());

    setTimeout(() => {
      const contractorListContainer = document.querySelector(
        ".contractor_list_container"
      );
      if (contractorListContainer) {
        contractorListContainer.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  };

  return (
    <div className={style["container"]}>
      <Navigation />
      <main className="search_container">
        <h1>Search</h1>
        <p>
          &quot;Our success is determined by new developers finding career
          positions in other companies. We foster skill, determine will, and
          help to establish the right attitude in new devs, reducing your risk
          of hiring for your own development team.&quot;
        </p>
        <div className="search_qualification_container">
          <p className="search_qualification_title">Search by Qualification</p>
          <div>
            <div className="search_options_radio_container">
              {qualificationsList.map((option) => (
                <div className="search_options_radio" key={option}>
                  <Radio
                    checked={selectedQualification.includes(option)}
                    onClick={() => handleOptionQualificationChange(option)}
                  />
                  {option}
                  <br />
                </div>
              ))}
            </div>
          </div>
        </div>
        <SearchSkills
          selectedQualification={selectedQualification}
          initialSelectedSkills={selectedSkills}
          getSelectedSkills={(skill) => setSelectedSkills(skill)}
        />
        <div className="search_location_container">
          <p className="search_location_title">Search by Location</p>
          <div className="search_location">
            <CSCSelector
              initialCountry={country}
              initialState={state}
              initialCity={city}
              getCountry={(country) => setCountry(country)}
              getState={(state) => setState(state)}
              getCity={(city) => setCity(city)}
            />
          </div>
        </div>
        <div className="button_container">
          <div className="search_button">
            <button onClick={handleSearch}>Search</button>
          </div>
          <div className="clear_button">
            <button onClick={handleClearAll}>Clear All</button>
          </div>
        </div>
        <ul className="contractor_list_container">
          <div className="message">
            {contractors.length === 1
              ? "1 match"
              : `${contractors.length} matches`}{" "}
            for your project!
          </div>
          {contractors.map((contractor) => (
            <div
              className="contractor_container"
              key={contractor?.id}
              onClick={() => {
                navigate(`/contractor/${contractor?.id}`, {
                  state: {
                    searchState: memoizedSearchState,
                  },
                });
              }}
            >
              <div className="result_container">
                <div className="result_percent">
                  <b>
                    {contractor.percentMatching ? (
                      `${contractor.percentMatching}%`
                    ) : (
                      <p></p>
                    )}
                  </b>
                </div>
                {contractor?.profileImg ? (
                  <div className="result_profile_image">
                    <img src={contractor?.profileImg} alt="Profile" />
                  </div>
                ) : (
                  <div className="result_no_image">
                    <img src={avatarURL} alt="Avatar" />
                  </div>
                )}
              </div>
              <div className="result_info">
                <div>
                  <b>{contractor?.firstName}&nbsp;</b>
                  <b>{contractor?.lastName}&nbsp;</b>
                  <div className="contractor_qualification_worksite">
                    <div className="contractor_qualification2">
                      {contractor?.qualification}
                    </div>
                    <div className="contractor_worksite">
                      {contractor?.workSite}
                    </div>
                  </div>
                </div>
                <div className="contractor_summary">{contractor.summary}</div>
                <div className="contractor_skills">
                  {contractor?.skills && (
                    <div className="result_skills_btns">
                      {contractor?.skills.map((resultSkill, index) => {
                        return (
                          <span key={index} className="badge">
                            {resultSkill.skill}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </ul>
      </main>
    </div>
  );
}
