import React, { useState, useEffect, useReducer, useRef } from "react";
import "./Chrono.css";

import PauseImg from "../Images/pause.svg";
import PlayImg from "../Images/play.svg";
import ResetImg from "../Images/reset.svg";

import BipSound from "./bip-sound.ogg";



const Chrono = (props) => {
    const bipAudio = useRef(new Audio(BipSound));

    const [ sessionTime, setSessionTime ] = useState(1500);
    const [ sessionTimeFixed, setSessionTimeFixed ] = useState(1500);

    const [ breakTime, setBreakTime ] = useState(300);
    const [ breakTimeFixed, setBreakTimeFixed ] = useState(300);

    const [ workingChrono,  setWorkingChrono ] = useState(false);

    const reducer = (state, action) => {
        if ((sessionTime <= 0 && breakTime === breakTimeFixed) || breakTime <= 0) bipAudio.current.play();

        switch (action.type) {
            case "TICK":
                if (sessionTime >= 0) {
                    setSessionTime(sessionTime - 1);
                } else if (breakTime >= 1) {
                    setBreakTime(breakTime - 1);
                } else if (breakTime <= 0 && breakTime <= 0) {
                    setSessionTime(sessionTimeFixed);
                    setBreakTime(breakTimeFixed);
                }
            break;

            default:
            break;
        }
    }

    const [ state, dispatch ] = useReducer(reducer);

    useEffect(() => {
        let timerId;

        if (workingChrono) {
            timerId = setInterval(() => {
                // console.log("Timer");
                dispatch({type: "TICK"});
            }, 1000);
        }

        return () => {
            clearInterval(timerId);
        }
    }, [workingChrono])

    const handlePlayPauseBtn = () => {
        setWorkingChrono(!workingChrono);
    }

    const handleSessionBtns = e => {
        const el = e.target;

        setBreakTime(breakTimeFixed);

        if (workingChrono) setWorkingChrono(!workingChrono);

        if (el.classList.contains("minus")) {
            if (sessionTime / 60 > 1) {
                setSessionTime(sessionTimeFixed - 60);
                setSessionTimeFixed(sessionTimeFixed - 60);
            }
        } else if (el.classList.contains("plus")) {
                setSessionTime(sessionTimeFixed + 60);
                setSessionTimeFixed(sessionTimeFixed + 60);
        }
    }

    const handleBreakBtns = e => {
        const el = e.target;

        if (el.classList.contains("minus")) {
            if (breakTime / 60 > 1) {
                setBreakTime(breakTimeFixed - 60);
                setBreakTimeFixed(breakTimeFixed - 60);
            }
        } else if (el.classList.contains("plus")) {
                setBreakTime(breakTimeFixed + 60);
                setBreakTimeFixed(breakTimeFixed + 60);
        }
    }

    const handleResetBtn = () => {
        if (workingChrono) {
            setWorkingChrono(!workingChrono);
        }

        setSessionTime(sessionTimeFixed);
        setBreakTime(breakTimeFixed);
    }
    
    return (
        <div className={`container-chrono ${workingChrono ? "anim-glow" : ""}`}>
            
            <div className="container-config">
                <div className="box-btns session">
                    <button className="minus" onClick={handleSessionBtns}>
                        -
                    </button>
                    <span>{sessionTimeFixed / 60}</span>
                    <button className="plus" onClick={handleSessionBtns}>
                        +
                    </button>
                </div>
                <div className="box-btns break">
                    <button className="minus" onClick={handleBreakBtns}>
                        -
                    </button>
                    <span>{breakTimeFixed / 60}</span>
                    <button className="plus" onClick={handleBreakBtns}>
                        +
                    </button>
                </div>
            </div>

            <h1>
                {
                    sessionTime >= 0 ? (
                        <span>
                            {`${Math.trunc(sessionTime / 60)} : ${sessionTime % 60 < 10 ? `0${sessionTime % 60}` : `${sessionTime % 60}`}`}
                        </span>
                    ) : 
                    (
                        <span>
                            {`${Math.trunc(breakTime / 60)} : ${breakTime % 60 < 10 ? `0${breakTime % 60}` : `${breakTime % 60}`}`}
                        </span>
                    )
                }
            </h1>

            <div className="container-controllers">
                <button onClick={handlePlayPauseBtn}>
                    <img src={workingChrono ? PauseImg : PlayImg} alt="bouttons play et pause" />
                </button>
                <button onClick={handleResetBtn}>
                    <img src={ResetImg} alt="boutton reset" />
                </button>
            </div>
        </div>
    );
};

export default Chrono;