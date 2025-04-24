const { useState } = React


export function useToggle(defaultValue) {
    const [isOn, setIsOn] = useState(defaultValue)

    function toggleIsOn(value) {
        if (typeof value === 'boolean') {
            setIsOn(value)
        } else {
            setIsOn(isOn => !isOn)
        }
    }

    return [isOn, toggleIsOn]

}