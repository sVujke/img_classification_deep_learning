import pandas as pd
from os import path
from pathing_utils import path_to_static


class SearchHistory():

    def __init__(self):
        self.HISTORY_FILE_PATH = path.join(path_to_static(), "history.csv")
        self.HISTORY_COLS = ["query", "times"]
        # self.df_history = self.read_history()

    def read_history(self):
        if path.isfile(self.HISTORY_FILE_PATH):
            return pd.read_csv(self.HISTORY_FILE_PATH)

        df = pd.DataFrame({}, columns=self.HISTORY_COLS)
        df.to_csv(self.HISTORY_FILE_PATH, index=False)
        return df

    def search_history_update(self, query):
        df = self.read_history()

        if query not in df["query"].values:
            df.loc[len(df)] = [query, 1]
        else:
            num = df[df['query'] == query]["times"].values[0]
            df.loc[df['query'] == query, "times"] = num + 1

        df.to_csv(self.HISTORY_FILE_PATH, index=False)
