// @flow

export class ServerRequest {

    static methods = ['serverRequest', 'get', 'update', 'remove'];

	endpoint: string;
  
    serverRequest(endpoint:string, ext: string) {
        this.endpoint = endpoint + "/" + ext + "/";
        
        this.onInsert(this._handleSyncInsert);
        this.onRemove(this._handleSyncRemove);
        this.onUpdate(this._handleSyncUpdate);
    }

    _handleSyncInsert = ({ changed }) => {

    }

    _handleSyncRemove = ({ changed }) => {

    }

    _handleSyncUpdate = ({ changed }) => {

    }

    async get(items: RequestItems, auth: AuthObject): Status {
        return await this._request("get", items, { auth });
    }

    async update(items: RequestItems, auth: AuthObject): Status {
        return await this._request("patch", items, { auth });
    }

    async create(items: RequestItems, auth: AuthObject): Status {
        let rs = await this._request("create", items, { auth });
        return rs;
    }

    async remove(id: string, auth: AuthObject): Status {
      return await this._request("delete", { id }, { auth });
    }

    _getRequestUrl = (type: RequestType, id: ?string): string => {
        switch (type) {
            case "create":
                return this.endpoint;
            default:
                return id ? this.endpoint + id : this.endpoint;
        }
    }

    _request = async (type: RequestType,  data: RequestItems, extra: Extras): Status => {
        
        var requestData = { data, ...extra }
        , requestUrl = this._getRequestUrl(type, data.id) 
        , request = await fetch(requestUrl, {
            method: type.toUpperCase(),
            body: JSON.stringify(requestData),
            "Content-Type": "application/json; charset=utf-8",
        });
        
        let rs = await request.json();
        return rs;
    }

} // class ServerRequest

type RequestType = "delete" | "get" | "create" | "patch";
type RequestItem = { id: string };
type RequestItems = Array<RequestItem> | RequestItem;
type AuthObject = { username: string, token: string };
type Status = { status: number, data: Array<Object>, message: string };
type Extras = { auth: { username: string, token: string }, limit: number };