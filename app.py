from flask import Flask, request, render_template, jsonify
import json
from fuzzywuzzy import process
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

app = Flask(__name__)

# Load the JSON file
try:
    with open('faq.json', 'r') as file:
        faq_data = json.load(file)
except Exception as e:
    print("Error loading FAQ file:", e)

# Variable to track if the initial greeting has been sent
initial_greeting_sent = False

@app.route('/download')
def download():
    return render_template('download.html')
# Home route
@app.route('/')
def home():
    return render_template('index.html')
@app.route('/appointment')
def appointment():
    return render_template('appointment.html')
@app.route('/bot')
def bot():
    return render_template('bot.html')
@app.route('/Lifestyle')
def lifestyle():
    return render_template('assessment.html')
@app.route('/Mental-Health')
def mentalHealth():
    return render_template('assessment1.html')
@app.route('/Lifestyle-Test')
def lifestyleTest():
    return render_template('LAssessment.html')
@app.route('/treatment')
def treatment():
    return render_template('treatment.html')
@app.route('/Mental-Health-Test')
def mentalHealthTest():
    return render_template('MAssessment.html')
@app.route('/nearyou')
def nearyou():
    return render_template('nearyou.html')
@app.route('/user-profile')
def userProfile():
    return render_template('userprofile.html')

# Function to analyze sentiment
def analyze_sentiment(message):
    analyzer = SentimentIntensityAnalyzer()
    sentiment_score = analyzer.polarity_scores(message)
    compound_score = sentiment_score['compound']
    
    if compound_score >= 0.05:
        return "positive"
    elif compound_score <= -0.05:
        return "negative"
    else:
        return "neutral"

# Chat route
@app.route('/chat', methods=['POST'])
def chat():
    global initial_greeting_sent

    user_message = request.form['user_message']

    # Check if the user's message ends with a question mark
    if user_message.strip().endswith('?'):
        # Search for the question in the FAQ data using fuzzy matching
        try:
            user_question = user_message.strip()[:-1]
            print("User question:", user_question)
            matched_question, confidence = process.extractOne(user_question.lower(), [qa['question'].lower() for qa in faq_data])
            print("Matched question:", matched_question, "Confidence:", confidence)
            
            if confidence >= 80:
                matched_qa = next(qa for qa in faq_data if qa['question'].lower() == matched_question.lower())
                answer = matched_qa['answer']
                print("Answer:", answer)
                bot_response = f"Bot: {answer}"
            else:
                bot_response = "Bot: Sorry, I couldn't find an answer to your question."
        except Exception as e:
            print("Error processing user question:", e)
            bot_response = "Bot: Sorry, there was an error processing your question."
    else:
        # Analyze sentiment of the user's message
        sentiment = analyze_sentiment(user_message)
        if sentiment == "positive":
            bot_response = "Bot: That's great to hear! Would you like to begin a self-counseling session to explore potential improvements? Please indicate by selecting 'yes' to proceed or no to proceed with any of your questions."
        elif sentiment == "negative":
            bot_response = "Bot: I'm sorry to hear that you're experiencing difficulties. It's important to address these issues when they persist. Would you like to begin a self-counseling session to explore potential solutions? Please indicate by selecting 'yes' to proceed or visit the Articles section for relevant resources."
        else:
            bot_response = "Bot: Thank you for sharing! Would you like to begin a self-counseling session to explore potential solutions? Please indicate by selecting 'yes' to proceed or visit the Articles section for relevant resources."

    print("Bot:", bot_response)
    return jsonify(bot_response)

@app.route('/action', methods=['POST'])
def action():
    action = request.form['action']
    if action == 'yes':
        bot_response = """Bot: self-counseling session. We will go through five steps to complete your self-counseling. If you have already completed these steps before, it will update your previous data.
Each step will require you to answer a simple question about yourself. Take your time to understand each question and answer it thoughtfully.
When you're ready, we can begin.             <button type="button" onclick="openPopup()"  id="startButton">Let's start</button>"""

    else:
        bot_response = "Bot: If you need any other help regarding your queries, please ask."

    print("Bot:", bot_response)
    return jsonify(bot_response)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5501, debug=True)
