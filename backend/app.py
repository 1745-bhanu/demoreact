import os
import matplotlib
matplotlib.use('Agg')  # Use the Agg backend for saving plots
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import matplotlib.pyplot as plt

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Set the path for the static folder relative to the app.py directory
static_folder_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')

@app.route('/api/apidata', methods=['POST'])
def receive_api_data():
    print("Received API request...")
    
    api_data = request.json
    print(f"Received API data: {api_data}")

    # Normalize the nested structure of the JSON data
    df = pd.json_normalize(api_data)
    print("Normalized data:")
    print(df)

    # Check if the DataFrame is empty
    if df.empty:
        print("DataFrame is empty. Cannot create a chart.")
        return jsonify({"message": "No data to plot."}), 400

    # Create a bar chart
    print("Creating bar chart...")
    plt.figure(figsize=(10, 5))
    plt.bar(df['place'], df['amount'], color='blue')
    plt.xlabel('Place')
    plt.ylabel('Amount')
    plt.title('Amount Spent by Place')
    plt.xticks(rotation=45)

    # Ensure the static directory exists
    if not os.path.exists(static_folder_path):
        print("'static' directory does not exist. Creating it...")
        os.makedirs(static_folder_path)

    # Save the plot to the static directory
    chart_path = os.path.join(static_folder_path, 'bar_chart.png')
    try:
        plt.savefig(chart_path)
        plt.close()
        print(f"Chart saved successfully at {chart_path}")
    except Exception as e:
        print(f"Failed to save the chart: {e}")
        return jsonify({"message": "Failed to save chart."}), 500

    return jsonify({"message": "API data received successfully", "received": api_data})

if __name__ == '__main__':
    app.run(port=5001, debug=True)