var homeservices = angular.module('home.services', []);

homeservices.factory("RequestService", function ($resource) {
    return $resource('http://ing-sis.jairoesc.com/vehicle?auth-token=eyJpdiI6IjVaemhPamdMcnZ3SXU5RHlmbTFTcUE9PSIsInZhbHVlIjoiZmpDdTVaRHA4UisyNjFTUmd3RVF4a2txakZiQjlEQlZ2SkpQNFpzZjY5cz0iLCJtYWMiOiJjNGVjZjE5ZWM4MTE2ZDJkOGMwMzkwMmQ5MTlkMjBiYjYyMTgyOTk1MTc2NDIzZWZlNjRlMDgwN2VmNmRkZjQwIn0=',
    	{},
    	{ get: { method: "GET", isArray: false }});
});