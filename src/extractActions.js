
export default function extractActions(definitionMap, dispatch) {
    const actionFunctions = {};
    const start = new Date();

    for (let k in definitionMap) {
        const definition = definitionMap[k];
        let name = definition.$actionName;

        if (!name) {
            continue;
        }

        if (actionFunctions[name]) {
            throw '[ACTION ALREADY EXISTS] Name: ' + name;
        }

        actionFunctions[name] = getActionCaller(k, definition, dispatch);
        actionFunctions[name].definition = definition;
    }

    const count = Object.keys(actionFunctions).length;
    if (count === 0)
        console.error('[NO ACTIONS FOUND] In definition map. (Missing $actionName properties?)', JSON.stringify(definitionMap));

    console.log(`[DEFMAP] Created ${count} actions in ${new Date() - start} ms`);

    return actionFunctions;
}

function getActionCaller(name, definition, dispatch) {
    const {$getPayload, $validation, $meta} = definition;

    if (name !== name.toUpperCase()) {
        console.error('[FORMAT_ERROR] Action names should be CAPITAL LETTERS ONLY:', JSON.stringify(name));
    }
    if ($getPayload && typeof $getPayload !== 'function') {
        console.error('[FORMAT_ERROR] Property $getPayload should be a function:', JSON.stringify(definition));
    }

    return function(...args) {
        const payload = $getPayload ? $getPayload(...args) : args[0];

        dispatch({
            type: name,
            payload,
            meta: $meta
        });
    };
}
