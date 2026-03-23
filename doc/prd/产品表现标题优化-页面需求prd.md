## 变更



feat: 产品表现标题优化入口支持按业务上下文创建新会话



## 变更内容



- 在点击 `src/views/storeOperations/productPerformanceDashboard/index.vue` 中的 **标题优化**操作列时，不需要弹出组件`src/views/ai/vabAutoComponents/AiChatDialog.vue`。变更为直接调用`src/api/devlocal/ai.ts`中的`createAiConversation`创建会话。
- 当`createAiConversation`返回的结果成功时，再次调用`src/api/devlocal/ai.ts`中的`sendAiChatMessage`方法



```py
import requests
import os
import uuid

api_key = 'YOUR_API_KEY_HERE'
url = "http://192.168.6.14:7860/api/v1/run/4efbc1b6-80e2-4f1d-b8d3-7839a256da0c"  # The complete API endpoint URL for this flow

# Request payload configuration
payload = {
    "output_type": "chat",
    "input_type": "chat",
    "tweaks": {
        "TextInput-7gpa6": {
            "input_value": "User ID"
        },
        "TextInput-0j6nj": {
            "input_value": "- Research competitors' similar products (ASINs) on Amazon, identify our product advantages, and highlight them in the title.\n- Include as many selling points and features as possible.\n- Ensure all relvant high volume keywords are in the title\n- Front-load high-volume, high-relevance keywords in titles.\n- Identify unique selling points from the bullet points and front-load these advantages in the title\n- Ensure the Brand Name is always the first word.\n- Fixed Title Structure: Brand + Core Keywords + Key Features (Material/Size) + Usage Scenario + Color\n- Do NOT exceed 200 characters in length (including punctuation).\n- Do NOT include existing trademarks in the title. If the product is accessory for a branded product, use for or compatible with before the brand. eg: For iPhone; Compatible with iPad\n- Do not repeat any word more than twice\n- Prohibit absolute terms (avoid superlatives and absolute claims such as 'best,' 'top,' '#1,' 'most popular,' 'cheapest')\n\n"
        },
        "ChatInput-q5Oxj": {
            "input_value": "",
            "session_id": ""
        },
        "TextInput-cvtBM": {
            "input_value": "B0GC72GDKR"
        },
        "TextInput-keD9Z": {
            "input_value": "1"
        },
        "TextInput-g6guw": {
            "input_value": "US"
        },
        "TextInput-0ceyW": {
            "input_value": "NiToy-0057-ValueSand"
        }
    }
}
payload["session_id"] = str(uuid.uuid4())

headers = {"x-api-key": api_key}

try:
    # Send API request
    response = requests.request("POST", url, json=payload, headers=headers)
    response.raise_for_status()  # Raise exception for bad status codes

    # Print response
    print(response.text)

except requests.exceptions.RequestException as e:
    print(f"Error making API request: {e}")
except ValueError as e:
    print(f"Error parsing response: {e}")
```

