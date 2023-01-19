const createAutoComplete = ({root, renderOption, onOptionSelect, inputValue, fetchData}) => {
    root.innerHTML = `
    <div class = "dropdownHolder">
        <div class = "mainDrop">
            <input class="search" type="text" placeholder="Enter a movie name...">
            <div class="dropdown">
                <div class="dropdown-menu">
                    <div class="dropdown-content result">
                    </div>
                </div>
            </div>
        </div>
    </div>
`;

const input = root.querySelector('input');
const dropDown = root.querySelector('.dropdown');
const resultWrapper = root.querySelector('.result');

const onInput = async event =>{
    const items = await fetchData(event.target.value);

    if(!items.length){
        dropDownHider(dropDown, resultWrapper)
        return;
    }
    resultWrapper.innerHTML = '';
    for(let item of items){
        const option = document.createElement('a');
        

        option.classList.add('dropdown-item');
        option.innerHTML = renderOption(item);
        option.addEventListener('click',() => {
            dropDownHider(dropDown, resultWrapper)
            input.value = inputValue(item)
            onOptionSelect(item)
        });
        dropDown.classList.add('is-active');
        resultWrapper.appendChild(option);
    }
};

input.addEventListener('input', debounce(onInput, 500))


document.addEventListener('click', event => {
    if(!root.contains(event.target)){
        dropDownHider(dropDown, resultWrapper)
    };
});


};

