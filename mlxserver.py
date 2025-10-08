import json
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import mlx.core as mx
from mlx_lm import load, generate

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

model = None
tokenizer = None
MODEL_NAME = "mlx-community/Qwen2.5-3B-Instruct-4bit"

def load_model():
    global model, tokenizer
    if model is None:
        logger.info(f"Loading model {MODEL_NAME}...")
        model, tokenizer = load(MODEL_NAME)
        logger.info("Model loaded successfully!")

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'model': MODEL_NAME})

@app.route('/score', methods=['POST'])
def score_tweet():
    try:
        data = request.get_json()
        tweet_text = data.get('tweetText', '')
        user_context = data.get('userContext', {})

        if not tweet_text:
            return jsonify({'success': False, 'error': 'No tweet text provided'}), 400

        system_prompt = """You are an evaluator that scores a tweet's potential performance on Twitter/X using five metrics.
        Return ONLY compact JSON with integer percentages (0-100) for the fields below. Do not include any extra keys or text.

        Definitions and constraints:
        - engagementLikelihood: Probability in-network followers will like/retweet/reply based on the tweet content.
        - conversationPotential: Likelihood of replies and multi-turn discussion driven by the tweet.
        - outOfNetworkReach: Likelihood the tweet travels beyond followers via recommendations and interests.
        - contentQuality: Clarity, structure, hook strength, novelty, readability, and safety.
        - authorReputation: STABLE score derived ONLY from the provided author context (followers, following ratio, account age, historical engagement, posting consistency, verification/profile completeness if present). It MUST NOT depend on the current tweet text. If the author context is unchanged, this value must be identical across calls.

        Rules:
        - Output integers 0-100 for all fields.
        - If certain author fields are missing, assume neutral defaults consistently so the authorReputation remains stable.
        - Include overallScore (0-100) as a concise summary that can combine the above dimensions but MUST NOT change how authorReputation is computed.
        - Do not include explanations."""

        user_prompt = f"""Score the following tweet using the five metrics and overallScore. Return JSON only.

        Tweet:
        {tweet_text}

        Author context (JSON):
        {json.dumps(user_context, indent=2)}"""

        prompt = f"<|im_start|>system\n{system_prompt}<|im_end|>\n<|im_start|>user\n{user_prompt}<|im_end|>\n<|im_start|>assistant\n"

        logger.info("Scoring tweet...")

        response = generate(
            model=model,
            tokenizer=tokenizer,
            prompt=prompt,
            max_tokens=256,
            verbose=False
        )

        try:
            response_clean = response.strip()

            if '{' in response_clean:
                start = response_clean.index('{')
                end = response_clean.rindex('}') + 1
                json_str = response_clean[start:end]
                parsed = json.loads(json_str)
            else:
                parsed = json.loads(response_clean)

            def clamp(n):
                return max(0, min(100, int(round(float(n or 0)))))

            metrics = {
                'engagementLikelihood': clamp(parsed.get('engagementLikelihood', 0)),
                'conversationPotential': clamp(parsed.get('conversationPotential', 0)),
                'outOfNetworkReach': clamp(parsed.get('outOfNetworkReach', 0)),
                'contentQuality': clamp(parsed.get('contentQuality', 0)),
                'authorReputation': clamp(parsed.get('authorReputation', 0)),
                'overallScore': clamp(parsed.get('overallScore', 0))
            }

            logger.info(f"Tweet scored: {metrics['overallScore']}/100")

            return jsonify({'success': True, 'metrics': metrics})

        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON response: {response}")
            return jsonify({'success': False, 'error': f'Failed to parse model response as JSON: {str(e)}'}), 500

    except Exception as e:
        logger.error(f"Error scoring tweet: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    logger.info("Starting MLX LLM Server...")
    load_model()
    logger.info("Server ready on http://localhost:5001")
    app.run(host='0.0.0.0', port=5001, debug=False)
