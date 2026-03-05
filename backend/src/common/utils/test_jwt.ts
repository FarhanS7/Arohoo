import { generateToken, verifyToken } from './jwt.js';

async function testJwtUtil() {
  const payload = {
    userId: "550e8400-e29b-41d4-a716-446655440000",
    role: "CUSTOMER"
  };
  
  console.log("Testing JWT Utility...");
  
  try {
    const token = generateToken(payload);
    console.log("Generated Token:", token.substring(0, 20) + "...");
    
    const decoded = verifyToken(token);
    console.log("Decoded Payload:", decoded);
    
    if (decoded.userId === payload.userId && decoded.role === payload.role) {
      console.log("✅ Verification Success!");
    } else {
      console.log("❌ Payload mismatch!");
    }

    // Test invalid token
    try {
      verifyToken("invalid.token.here");
      console.log("❌ Failed: Invalid token was accepted");
    } catch (e) {
      console.log("✅ Correctly rejected invalid token");
    }

  } catch (error) {
    console.error("error during testing:", error);
  }
}

testJwtUtil();
