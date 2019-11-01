import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.api.core.ApiFuture;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;

@WebServlet("*.do")
public class servlet extends HttpServlet{
	
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String contextPath = req.getContextPath() + "/";
		
		if (req.getRequestURI().equals(contextPath + "save.do")) {
			asd();
		}
		
		if (req.getRequestURI().equals(contextPath + "aa.do")) {
			req.getRequestDispatcher("web.html").forward(req, resp);
		}
		
		
	}

	public void asd() {
		try {
			GoogleCredentials credentials = GoogleCredentials.getApplicationDefault();
			FirebaseOptions options = new FirebaseOptions.Builder().setCredentials(credentials).setProjectId("fir-ex-63c1a")
					.build();
			FirebaseApp.initializeApp(options);
			Firestore db = FirestoreClient.getFirestore();

			DocumentReference docRef = db.collection("users").document("alovelace");
			Map<String, Object> data = new HashMap<>();
			data.put("first", "Ada");
			data.put("last", "Lovelace");
			data.put("born", 1815);
			//asynchronously write data
			ApiFuture<WriteResult> result = docRef.set(data);
			// ...
			// result.get() blocks on response
			System.out.println("Update time : " + result.get().getUpdateTime());
			
			
		} catch (IOException e) {
			e.printStackTrace();
		} catch (InterruptedException e) {
			e.printStackTrace();
		} catch (ExecutionException e) {
			e.printStackTrace();
		}

	}

}
