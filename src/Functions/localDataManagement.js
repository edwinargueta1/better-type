export function clearStoredLessons(){
    window.localStorage.removeItem("storedLessons");
}
export function clearLocalProfileData(setFunction, ref){
    setFunction(null)
    ref.current = false;
}

export function toggleState(variable, functionVariable){
    functionVariable(!variable)
  }