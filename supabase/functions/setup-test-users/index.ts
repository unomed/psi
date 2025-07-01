
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.31.0";

// This function will be called when the Edge Function is invoked
serve(async (req: Request) => {
  try {
    // Create a Supabase client with the Admin key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Define our test users
    const testUsers = [
      {
        email: "superadmin@test.com",
        password: "super123",
        fullName: "Super Admin",
        role: "superadmin"
      },
      {
        email: "admin@company.com",
        password: "admin123",
        fullName: "Admin da Empresa",
        role: "admin"
      },
      {
        email: "evaluator@company.com",
        password: "eval123",
        fullName: "Avaliador",
        role: "evaluator"
      }
    ];

    const results = [];

    // Create each test user
    for (const user of testUsers) {
      // Check if user already exists
      const { data: existingUsers } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", user.role);

      // Skip if we already have a user with this role
      if (existingUsers && existingUsers.length > 0) {
        results.push(`User with role ${user.role} already exists, skipping`);
        continue;
      }

      // Create the user
      const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.fullName
        }
      });

      if (createError) {
        results.push(`Error creating ${user.email}: ${createError.message}`);
        continue;
      }

      // Assign the role
      if (authUser?.user) {
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({
            user_id: authUser.user.id,
            role: user.role
          });

        if (roleError) {
          results.push(`Error assigning role to ${user.email}: ${roleError.message}`);
        } else {
          results.push(`Successfully created user ${user.email} with role ${user.role}`);
        }
      }
    }

    return new Response(
      JSON.stringify({ message: "Setup complete", results }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
