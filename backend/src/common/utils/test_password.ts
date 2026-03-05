import { hashPassword, verifyPassword } from './password.js';

async function testPasswordUtil() {
  const rawPassword = "securepassword123";
  
  console.log("Testing Password Utility...");
  
  try {
    const hash = await hashPassword(rawPassword);
    console.log("Generated Hash:", hash);
    
    const isValid = await verifyPassword(hash, rawPassword);
    console.log("Verification Success:", isValid);
    
    const isInvalid = await verifyPassword(hash, "wrongpassword");
    console.log("Invalid Verification correctly failed:", !isInvalid);
    
    if (isValid && !isInvalid) {
      console.log("✅ All tests passed!");
    } else {
      console.log("❌ Tests failed!");
    }
  } catch (error) {
    console.error("error during testing:", error);
  }
}

testPasswordUtil();
