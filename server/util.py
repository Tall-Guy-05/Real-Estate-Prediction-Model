import json
import pickle
import numpy as np

__locations = None
__data_columns = None
__model = None

def get_estimated_price(location, sqft, bhk, bath):
    try:
        loc_index = __data_columns.index(location.lower())
    except:
        loc_index = -1

    x = np.zeros(len(__data_columns))
    x[0] = sqft
    x[1] = bath
    x[2] = bhk
    if loc_index >= 0:
        x[loc_index] = 1

    return round(__model.predict([x])[0], 2)

def get_location():
    return __locations

def load_artifacts():
    print("Loading saved artifacts...start")
    global __locations, __data_columns, __model

    with open("./artifacts/columns.json", 'r') as f:
        __data_columns = json.load(f)['data_columns']
    
        all_locations = __data_columns[3:]
        unwanted_locations = ['thank you', 'garden road']
        # This keeps only the locations that are NOT in the unwanted_locations list.
        __locations = [loc for loc in all_locations if loc.lower() not in unwanted_locations]
    with open('./artifacts/Pune_Real_Estate_Prediction.pickle', 'rb') as f:
        __model = pickle.load(f)
        
    print("Loaded saved artifacts...done")

if __name__ == '__main__':
    load_artifacts()
    print(get_location())
    print(get_estimated_price("alandi road", 1000, 3, 3))
    print(get_estimated_price("balaji nagar", 1000, 2, 2))