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

        system_prompt = """You are an expert Twitter/X analytics predictor that estimates tweet performance based on content quality and author profile.
        Return ONLY a JSON object with these 4 fields. Do not include any extra keys, text, or explanations.

        Required output format:
        {
          "estimatedReplies": integer,
          "estimatedReposts": integer,
          "estimatedLikes": integer,
          "estimatedViews": integer
        }

        ANALYSIS FRAMEWORK - Use this internally to calculate estimates:

        Step 1 - Assess tweet content quality (0-100 scale):
        - Hook strength: Does it grab attention in the first 5 words?
        - Clarity: Is the message clear and easy to understand?
        - Emotional resonance: Does it evoke curiosity, excitement, controversy, or strong emotion?
        - Relevance: Is it timely or tapping into trending topics?
        - Shareability: Would people want to retweet or discuss this?
        - Conversation catalyst: Does it ask questions or invite debate?

        Step 2 - Assess author credibility from profile (0-100 scale):
        - Expertise level: What domain authority do they have based on their background?
        - Achievements: Notable accomplishments, awards, or recognition?
        - Community involvement: Are they active in meaningful conversations or communities?
        - Audience size inference: Based on accomplishments, estimate if they're nano (1k-10k), micro (10k-100k), or larger

        Step 3 - Apply realistic Twitter engagement benchmarks (2024/2025 data):

        ENGAGEMENT RATE BENCHMARKS:
        - Overall platform average: 0.029% (likes + retweets + replies / followers)
        - Good performance: 0.045% to 0.102%
        - Excellent performance: Above 0.102%
        - Smaller accounts (1k-10k): Higher engagement rates, often 0.1-0.5%
        - Mid-tier accounts (10k-100k): 0.05-0.15%
        - Large accounts (100k+): 0.02-0.05%

        METRIC-SPECIFIC PATTERNS:
        - Replies: Typically 5-15% of total engagement (lowest of the three)
        - Reposts: Typically 15-25% of total engagement
        - Likes: Typically 60-80% of total engagement (highest)
        - Views: 10-30x follower count for normal content, 50-200x for viral content

        CALCULATION APPROACH:
        1. Infer follower range from author profile (nano: 1k-10k, micro: 10k-100k, mid: 100k-500k, large: 500k+)
        2. Estimate engagement rate based on content quality and author credibility (use benchmarks above)
        3. Calculate total engagement = estimated_followers × engagement_rate
        4. Distribute engagement: ~70% likes, ~20% reposts, ~10% replies
        5. Calculate views based on virality potential (higher for controversial/emotional content)

        RULES:
        - Output realistic numbers based on 2024/2025 Twitter benchmarks
        - High-quality content from credible authors = higher estimates
        - Poor content or weak profile = lower estimates
        - All values must be positive integers
        - If author profile is minimal, assume nano-tier (1k-5k followers) with average engagement
        - Return ONLY the JSON object, no explanations"""

        user_prompt = f"""Score the following tweet using all required metrics including estimated engagement numbers. Return JSON only.

        Tweet:
        {tweet_text}

        Author profile summary:
        {user_context if user_context else "No author profile provided"}"""

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

            def clamp_positive(n):
                return max(0, int(round(float(n or 0))))

            metrics = {
                'estimatedReplies': clamp_positive(parsed.get('estimatedReplies', 0)),
                'estimatedReposts': clamp_positive(parsed.get('estimatedReposts', 0)),
                'estimatedLikes': clamp_positive(parsed.get('estimatedLikes', 0)),
                'estimatedViews': clamp_positive(parsed.get('estimatedViews', 0))
            }

            logger.info(f"Tweet scored - Views: {metrics['estimatedViews']}, Likes: {metrics['estimatedLikes']}")

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
