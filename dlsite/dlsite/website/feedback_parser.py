import pandas as pd
from os import path
from pathing_utils import path_to_static


class FeedbackParser():

    def __init__(self):
        self.df_feedback = self.read_feedback()
        self.FEEDBACK_FILE_PATH = path_to_static() + "feedback.csv"
        self.FEEDBACK_COLS = ["query", "step", "image", "status"]

    def save_feedback(self, query, step, selected_images, non_selected_images):
        res = []
        for img in selected_images:
            res.append([query, step, img, "1"])

        for img in non_selected_images:
            res.append([query, step, img, "0"])

        df_tmp = pd.DataFrame(res)
        df_tmp.columns = self.FEEDBACK_COLS
        self.df_feedback = self.df_feedback.append(df_tmp, ignore_index=True)
        self.df_feedback.to_csv(self.FEEDBACK_FILE_PATH, index=False)

        return True

    def read_feedback(self):
        if path.isfile(self.FEEDBACK_FILE_PATH):
            return pd.read_csv(self.FEEDBACK_FILE_PATH)

        df = pd.DataFrame({}, columns=self.FEEDBACK_COLS)
        df.to_csv(self.FEEDBACK_FILE_PATH, index=False)
        return df





