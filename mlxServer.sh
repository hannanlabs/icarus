DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

source "$DIR/icarus/bin/activate"

echo "Starting MLX LLM Server on port 5001..."
echo "Model: mlx-community/Qwen2.5-3B-Instruct-4bit"
echo "Press Ctrl+C to stop"
echo ""

python3 "$DIR/mlxserver.py"
