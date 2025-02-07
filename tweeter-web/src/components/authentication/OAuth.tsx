import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import useToastListener from "../toaster/ToastListenerHook";
import { IconName } from "@fortawesome/fontawesome-svg-core";

const OAuth = () => {
  const { displayInfoMessage } = useToastListener();

  const displayInfoMessageWithDarkBackground = (message: string): void => {
    displayInfoMessage(message, 3000, "text-white bg-primary");
  };

  const OAuthButton = ({buttonName, tooltipId, iconName}: {buttonName: string, tooltipId: string, iconName: IconName}) => {
    return (
      <button
        type="button"
        className="btn btn-link btn-floating mx-1"
        onClick={() => displayInfoMessageWithDarkBackground(`${buttonName} registration is not implemented.`)}
      >
        <OverlayTrigger placement="top" overlay={<Tooltip id={tooltipId}>Google</Tooltip>}>
          <FontAwesomeIcon icon={["fab", iconName]} />
        </OverlayTrigger>
      </button>
    );
  }

  return (
    <div className="text-center mb-3">
      <OAuthButton buttonName="Google" tooltipId="googleTooltip" iconName="google" />
      <OAuthButton buttonName="Facebook" tooltipId="facebookTooltip" iconName="facebook" />
      <OAuthButton buttonName="Twitter" tooltipId="twitterTooltip" iconName="twitter" />
      <OAuthButton buttonName="LinkedIn" tooltipId="linkedInTooltip" iconName="linkedin" />
      <OAuthButton buttonName="GitHub" tooltipId="githubTooltip" iconName="github" />
    </div>
  );
};

export default OAuth;
