import {useEffect, useRef} from "react";
import {createCustomEqual} from "fast-equals";
import { isLatLngLiteral } from "@googlemaps/typescript-guards";

const deepCompareEqualsForMaps = createCustomEqual(
    (deepEqual) => (a, b) => {
        if (
            isLatLngLiteral(a) ||
            a instanceof  google.maps.LatLng ||
            isLatLngLiteral(b) ||
            b instanceof google.maps.LatLng
        ) {

            return new google.maps.LatLng(a).equals(new google.maps.LatLng(b));
        }
        // TODO extend to other types

        // use fast-equals for other objects
        return deepEqual(a, b);
    }
);
function useDeepCompareMemoize(value) {
    const ref = useRef();
    if (!deepCompareEqualsForMaps(value, ref.current)) {
        ref.current = value;
    }

    return ref.current;
}

export function useDeepCompareEffectForMaps(
    callback,
    dependencies
) {
    useEffect(callback, dependencies.map(useDeepCompareMemoize));
}


